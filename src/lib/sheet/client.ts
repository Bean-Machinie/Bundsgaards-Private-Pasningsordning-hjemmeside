/**
 * Fetching the sheet, and remembering it.
 *
 * The shape of this is stale-while-revalidate, and the reason is worth stating
 * plainly: a visitor should never wait on Google Sheets to read the opening
 * hours. So the page renders from something it already has — the copy stored
 * in this browser, or failing that the copy compiled into the bundle — and
 * looks for a newer one in the background. If there is one, the page updates.
 * If there isn't, nothing happens at all: no re-render, no flicker, no work.
 *
 * "Is there a newer one" is answered by hashing the CSV, because the export
 * carries no ETag and no usable Last-Modified. That means the request is still
 * made, but a sheet that hasn't changed costs one conditional-free GET every
 * five minutes at most and changes nothing on the page — which is the
 * observable part of "don't re-fetch unless something changed".
 */

import { CACHE_KEY, FETCH_TIMEOUT_MS, SHEET_CSV_URL } from './config';

export interface Stored {
  /** The raw export, kept rather than the parsed result: the parser is allowed
   *  to improve between visits, and re-parsing 4 KB is free. */
  csv: string;
  hash: string;
  /** When it was fetched, so staleness is a question we can answer offline. */
  at: number;
}

/**
 * FNV-1a, 32-bit.
 *
 * Not a security hash — an equality check on a few kilobytes of text that has
 * to run on the main thread during startup. Collisions would mean missing an
 * edit until the next visit, which is why it hashes the whole string rather
 * than sampling it.
 */
export function hashCsv(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

/* localStorage throws rather than degrades in a few real situations — Safari's
   private mode historically, and any browser once the origin's quota is full —
   and none of them are a reason for the site not to load. Both sides are
   therefore total functions: storage is an optimisation, never a dependency. */

export function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (typeof parsed.csv !== 'string' || typeof parsed.hash !== 'string') return null;
    return { csv: parsed.csv, hash: parsed.hash, at: Number(parsed.at) || 0 };
  } catch {
    return null;
  }
}

export function writeStored(entry: Stored): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* Out of quota or storage denied — the site works, it just re-fetches. */
  }
}

/**
 * Ask the sheet for its current contents.
 *
 * `cache: 'no-store'` is deliberate and is not about being impatient: the
 * browser's HTTP cache would otherwise hand back the same five-minute-old body
 * without asking Google, on top of the five-minute revalidation window here —
 * so an edit could take ten minutes to appear instead of five. The timing is
 * decided in one place (REVALIDATE_AFTER_MS), not two.
 */
export async function fetchSheetCsv(signal?: AbortSignal): Promise<string> {
  /* A unique URL every time. `cache: 'no-store'` already stops *this* browser
     reusing a body, but the response comes back marked `max-age=300`, and
     anything between here and Google — a proxy, a service worker, a phone
     carrier's cache — is entitled to act on that. A cache-buster costs one
     query parameter (the export ignores unknown ones) and takes the whole
     question off the table, leaving Google's own publishing lag as the only
     delay between an edit and the site. */
  const url = new URL(SHEET_CSV_URL);
  url.searchParams.set('_', String(Date.now()));

  const timeout = new AbortController();
  const timer = window.setTimeout(() => timeout.abort(), FETCH_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const response = await fetch(url, {
      signal: timeout.signal,
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`Sheet responded ${response.status}`);
    return await response.text();
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}
