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

/** Read the published URL out of config.ts rather than repeating it here —
 *  two copies of that URL is one copy too many, and this script is the one
 *  place outside the browser that needs it. */
async function sheetUrl() {
  const source = await readFile(CONFIG, 'utf8');
  const match = /'(https:\/\/docs\.google\.com\/spreadsheets\/[^']+output=csv)'/.exec(source);
  if (!match) throw new Error('Could not find the published CSV URL in src/lib/sheet/config.ts');
  return match[1];
}

/** The same test the browser applies: does this look like the sheet, or like
 *  an empty tab, a sign-in page, or a document that was unpublished? */
function looksLikeTheSheet(csv) {
  if (csv.trim() === '') return false;
  if (/^\s*</.test(csv)) return false;
  return /^#\s*\S/m.test(csv.replace(/^"|"$/gm, ''));
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
  // First cell only — the rest of a header row carries column hints for whoever
  // is editing the sheet, which have no business in this line.
  const blocks = (csv.match(/^#\s*\S.*$/gm) ?? []).map((line) =>
    line.split(',')[0].replace(/^#\s*/, '').replace(/^"|"$/g, '').trim(),
  );
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
