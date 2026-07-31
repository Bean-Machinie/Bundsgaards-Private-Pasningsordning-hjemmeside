/**
 * Where the content comes from, and how eagerly the site goes looking for it.
 */

/**
 * The spreadsheet's document id — the long code in the address bar while the
 * sheet is open:
 *
 *     https://docs.google.com/spreadsheets/d/THIS_PART_HERE/edit#gid=430302844
 *
 * It is **not** the `2PACX-…` code in a "Publicér på nettet" link. Those are
 * two different identifiers for two different things, and the difference is
 * the whole reason this constant exists — see `SHEET_CSV_URL` below.
 *
 * The document has to be shared **"Alle med linket" → "Læser"** for this to be
 * readable without a login. That is a different switch from publishing, and
 * both can be on at once.
 */
export const SHEET_DOC_ID = '1Xr349RUKU7m3k56wXA7pbRNKOvt_mCrJmOwgHEqMt4U';

/** The tab, by its id. Taken from `#gid=` in the address bar, or from `gid=`
 *  in the published link — the number is the same in both. */
export const SHEET_GID = '430302844';

/** The tab that `gid` points at — for error messages and the docs. */
export const SHEET_TAB = 'Bundsgård Privat Pasningsordning - INFO';

/**
 * The live query endpoint: it reads the document itself, on every request.
 *
 * This is deliberately *not* the published `/d/e/2PACX-…/pub?output=csv` URL,
 * and the distinction matters more than it looks:
 *
 *   **`/pub`** does not read the spreadsheet. It reads a snapshot Google
 *   generates at publish time and serves from a CDN whose edge nodes re-pull
 *   that snapshot independently of one another. So one node can have an edit
 *   while another still doesn't, and which one a visitor reaches varies per
 *   request. The symptom is not "late" — it is *reload, new value; reload, old
 *   value; reload, new value again*, indefinitely. No amount of cache-busting
 *   fixes it, because the caches disagreeing are Google's and each one is
 *   serving exactly what it was told to.
 *
 *   **`/gviz/tq`** queries the live document. There is no snapshot to go stale
 *   and no publish step to forget, so an edit is visible on the next request.
 *   It costs a sharing setting instead of a publish, and returns the same
 *   plain CSV, so nothing downstream changes.
 *
 * `headers=0` tells the query layer that no row is a header. Without it, gviz
 * guesses, and a guess that lands on the notes at the top of the sheet would
 * quietly change which rows come back as data.
 *
 * One thing to know about this endpoint: it types each column as a whole and
 * formats the values to match. A column holding any prose comes back as text,
 * which is every column in this layout — column A is always labels and column
 * B always has sentences in it. A card whose column B was *nothing but* bare
 * numbers could see them reformatted (`6.00` → `6`); writing a unit next to
 * them, as this sheet already does, keeps the column text.
 */
const liveCsvUrl = (docId: string, gid: string) =>
  `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&headers=0&gid=${gid}`;

/**
 * The published export — kept only as the stand-in for an unset `SHEET_DOC_ID`,
 * so the site still has a source before anyone has pasted one in. It carries
 * the flip-flopping described above, and is not where this should end up.
 */
const PUBLISHED_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRA8r74-ifqfq6h7tAbu7g-VqR08qY5QlAN-2bxgOVE-cnMebEYstBWSs9LJChhu55NlXbbR-uVF_L7/pub?gid=430302844&single=true&output=csv';

/** Overridable for a staging copy of the sheet, without a code change. */
export const SHEET_CSV_URL =
  import.meta.env.VITE_SHEET_CSV_URL ||
  (SHEET_DOC_ID ? liveCsvUrl(SHEET_DOC_ID, SHEET_GID) : PUBLISHED_CSV);

/** True while the site is still on the published snapshot. The provider says
 *  so in the console rather than letting it be discovered by symptom. */
export const USING_PUBLISHED_FALLBACK = !import.meta.env.VITE_SHEET_CSV_URL && !SHEET_DOC_ID;

/** Bump to invalidate every visitor's stored copy at once, if the format ever
 *  changes in a way an old cache would be parsed wrongly by. */
export const CACHE_KEY = 'bundsgaard:sheet:2';

/**
 * How long a stored copy is trusted *within a session* before the site looks
 * again — the tab-refocus check, and nothing else.
 *
 * Every page load fetches regardless (see provider.tsx): loading a page is
 * someone asking for the current state, and a throttle that answers it out of
 * a copy stored minutes ago makes the site look broken to whoever just edited
 * the sheet. This number only stops a tab being flicked in and out from asking
 * the document for the same answer several times a minute.
 */
export const REVALIDATE_AFTER_MS = 5 * 60 * 1000;

/** A sheet that hasn't answered in this long isn't going to save the page
 *  load. The site already has content; it can try again later. */
export const FETCH_TIMEOUT_MS = 8000;
