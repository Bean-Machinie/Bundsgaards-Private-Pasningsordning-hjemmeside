/**
 * Bake the current Google Sheet into the bundle.
 *
 * The site fetches the sheet at runtime, so this is not what makes an edit
 * appear — that happens within minutes, by itself. What this does is decide
 * what a *first-ever visitor* sees on the first paint, before any fetch has
 * finished: with a fresh snapshot, the real content; without one, whatever was
 * true at the last deploy.
 *
 * It runs automatically before `npm run build`, and never fails the build. A
 * laptop on a train, a CI runner with no egress, a sheet that is being edited
 * at that exact moment: all of those leave the committed snapshot in place and
 * carry on, because a stale snapshot costs a few hundred milliseconds of
 * staleness on one page load, and a failed build costs a deploy.
 *
 *   node scripts/sync-sheet.mjs          fail loudly (for running by hand)
 *   node scripts/sync-sheet.mjs --soft   warn and exit 0 (for the build)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const SNAPSHOT = fileURLToPath(new URL('../src/content/sheet-snapshot.csv', import.meta.url));
const CONFIG = fileURLToPath(new URL('../src/lib/sheet/config.ts', import.meta.url));

const soft = process.argv.includes('--soft');

/** Build the same URL the browser will, from the same constants — reading them
 *  out of config.ts rather than repeating them here. Two copies of a document
 *  id is one copy too many, and this script is the only thing outside the
 *  browser that needs one. */
async function sheetUrl() {
  const source = await readFile(CONFIG, 'utf8');
  const docId = /SHEET_DOC_ID\s*=\s*'([^']*)'/.exec(source)?.[1] ?? '';
  const gid = /SHEET_GID\s*=\s*'([^']*)'/.exec(source)?.[1] ?? '';

  if (docId) {
    return `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&headers=0&gid=${gid}`;
  }

  // No document id yet, so the site is still on the published snapshot. Mirror
  // that here rather than silently syncing from a different source than the
  // one visitors are reading.
  const published = /'(https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[^']+output=csv)'/.exec(
    source,
  );
  if (!published) throw new Error('No SHEET_DOC_ID and no published URL in src/lib/sheet/config.ts');
  console.warn(
    'sync-sheet: SHEET_DOC_ID is empty, so this is reading the published snapshot — ' +
      'which can serve a different vintage per request. Set it in src/lib/sheet/config.ts.',
  );
  return published[1];
}

/**
 * The first cell of a CSV line, unquoted.
 *
 * Needed because the two endpoints disagree about quoting: the published
 * export only quotes cells that need it, while gviz quotes every cell. A
 * regex looking for a bare `#` at the start of a line finds every block in one
 * and none in the other, which is exactly the sort of thing that turns into a
 * validator that silently passes everything.
 */
function firstCell(line) {
  if (!line.startsWith('"')) return line.split(',')[0].trim();

  let out = '';
  let i = 1;
  while (i < line.length) {
    if (line[i] === '"') {
      if (line[i + 1] === '"') {
        out += '"';
        i += 2;
        continue;
      }
      break;
    }
    out += line[i];
    i += 1;
  }
  return out.trim();
}

/** Every block name in the file, in order. */
function blockNames(csv) {
  return csv
    .split('\n')
    .map((line) => firstCell(line))
    .filter((cell) => cell.startsWith('#') && cell.length > 1)
    .map((cell) => cell.slice(1).trim());
}

/** The same test the browser applies: does this look like the sheet, or like
 *  an empty tab, a sign-in page, or a document that lost its sharing? */
function looksLikeTheSheet(csv) {
  if (csv.trim() === '') return false;
  if (/^\s*</.test(csv)) return false;
  return blockNames(csv).length > 0;
}

async function main() {
  const url = await sheetUrl();
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Sheet responded ${response.status} ${response.statusText}`);

  const csv = await response.text();
  if (!looksLikeTheSheet(csv)) {
    throw new Error(
      'The sheet answered, but with nothing that looks like content — no "# …" blocks. ' +
        'Check that the tab is still published to the web and still has rows in it.',
    );
  }

  const current = await readFile(SNAPSHOT, 'utf8').catch(() => '');
  if (current === csv) {
    console.log('sync-sheet: snapshot already current');
    return;
  }

  await writeFile(SNAPSHOT, csv, 'utf8');
  const blocks = blockNames(csv);
  console.log(`sync-sheet: snapshot updated — ${blocks.length} blocks (${blocks.join(', ')})`);
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (soft) {
    console.warn(`sync-sheet: keeping the committed snapshot — ${message}`);
    process.exit(0);
  }
  console.error(`sync-sheet: ${message}`);
  process.exit(1);
}
