/**
 * Where the content comes from, and how eagerly the site goes looking for it.
 */

/**
 * The sheet, published to the web as CSV.
 *
 * This is the "Publicér på nettet" link with two changes: `pubhtml` → `pub`,
 * and `output=csv` on the end. Same document, same tab (`gid` picks the tab —
 * this one is "Bundsgård Privat Pasningsordning - INFO"), but the export
 * instead of the rendered page.
 *
 * Publishing is what makes this work without an API key, and it is also the
 * whole of the security model: everything in that tab is public. Nothing
 * private belongs in it.
 *
 * Note it is the *published* id (`/d/e/2PACX-…`), which is not the document id
 * in the address bar — republishing from the sheet's own menu keeps it stable,
 * so this rarely needs touching.
 */
const PUBLISHED_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRA8r74-ifqfq6h7tAbu7g-VqR08qY5QlAN-2bxgOVE-cnMebEYstBWSs9LJChhu55NlXbbR-uVF_L7/pub?gid=430302844&single=true&output=csv';

/** Overridable for a staging copy of the sheet, without a code change. */
export const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || PUBLISHED_CSV;

/** The tab the `gid` above points at — for error messages and the docs. */
export const SHEET_TAB = 'Bundsgård Privat Pasningsordning - INFO';

/** Bump to invalidate every visitor's stored copy at once, if the format ever
 *  changes in a way an old cache would be parsed wrongly by. */
export const CACHE_KEY = 'bundsgaard:sheet:1';

/**
 * How long a stored copy is trusted *within a session* before the site looks
 * again — the tab-refocus check, and nothing else.
 *
 * Every page load fetches regardless (see provider.tsx): loading a page is
 * someone asking for the current state, and a throttle that answers it out of
 * a copy stored minutes ago makes the site look broken to whoever just edited
 * the sheet. This number only stops a tab being flicked in and out from asking
 * repeatedly for a body Google hasn't regenerated — its published export lags
 * an edit by up to about five minutes no matter how often it is asked.
 */
export const REVALIDATE_AFTER_MS = 5 * 60 * 1000;

/** A sheet that hasn't answered in this long isn't going to save the page
 *  load. The site already has content; it can try again later. */
export const FETCH_TIMEOUT_MS = 8000;
