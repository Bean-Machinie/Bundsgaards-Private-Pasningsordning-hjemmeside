/**
 * Google Drive share links → usable image URLs.
 *
 * What the caretaker pastes into the sheet is whatever "Kopiér link" put on her
 * clipboard, which is a *viewer* page, not a picture:
 *
 *     https://drive.google.com/file/d/1AbC…xyz/view?usp=drive_link
 *
 * Pointing an <img> at that gets an HTML page back. The file id inside it is
 * the part that matters, and Drive will serve the picture itself from
 *
 *     https://lh3.googleusercontent.com/d/<id>=w1200
 *
 * — Google's own image CDN, which also resizes on demand. That last part is
 * what makes a sheet-driven gallery viable at all: the caretaker uploads a
 * 6 MB photo straight off a phone, and a visitor on mobile data is served a
 * 480px-wide re-encode of it instead. `=w` asks for a width and lets the height
 * follow, so nothing is cropped.
 *
 * The older `drive.google.com/thumbnail?id=…` endpoint serves the same picture
 * and is kept as the fallback the <img> retries with — the two have different
 * rate limits and different bad days.
 *
 * The file has to be shared as "Alle med linket" for either to work. Nothing
 * here can detect that; a file that isn't shared simply 404s and the tile falls
 * back to its placeholder.
 */

/** Drive ids are base64url-ish and always long; 20 is well clear of any word
 *  that could appear in a path segment. */
const ID_PATTERNS = [
  /\/file\/d\/([-\w]{20,})/, // …/file/d/<id>/view    — the share link
  /\/d\/([-\w]{20,})/, //       …/d/<id>=w800    — an lh3 URL pasted back in
  /[?&]id=([-\w]{20,})/, //     …?id=<id>        — open?id= and uc?id=
];

/** The file id inside any shape of Drive URL, or null if there isn't one. */
export function driveFileId(url: string): string | null {
  const trimmed = url.trim();
  if (!/drive\.google\.com|googleusercontent\.com|docs\.google\.com/.test(trimmed)) {
    return null;
  }
  for (const pattern of ID_PATTERNS) {
    const match = pattern.exec(trimmed);
    if (match) return match[1];
  }
  return null;
}

/**
 * The widths the gallery asks the CDN for.
 *
 * One ladder serves both the mosaic and the viewer: a tile declares it will be
 * drawn a quarter of the viewport wide and the browser takes a rung near the
 * bottom, the viewer declares nine tenths and it takes one near the top. Two
 * separate sets would mean the same photograph downloaded twice.
 */
export const IMAGE_WIDTHS = [480, 800, 1200, 1600, 2048] as const;
/** The top rung — the `src` a viewer falls back to without srcSet support. */
export const FULL_WIDTH = 2048;

/** A single rendition, `width` px across. */
export function driveImage(id: string, width: number): string {
  return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
}

/** The same rendition from Drive's own thumbnail endpoint — the retry. */
export function driveImageFallback(id: string, width: number): string {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
}

/** A `srcSet` across IMAGE_WIDTHS, so the browser picks by layout width and
 *  device pixel ratio rather than the page guessing for it. */
export function driveSrcSet(id: string, widths: readonly number[] = IMAGE_WIDTHS): string {
  return widths.map((width) => `${driveImage(id, width)} ${width}w`).join(', ');
}

export interface ResolvedImage {
  /** The `src` an <img> should start from. */
  src: string;
  /** Candidate renditions, or undefined for a plain URL we can't resize. */
  srcSet?: string;
  /** Full size, for the lightbox. */
  full: string;
  /** A second URL to retry with once, if the first fails. */
  retry?: string;
}

/**
 * Whatever went in the sheet's link column → what the page should load.
 *
 * A Drive link becomes a resizable set. Anything else that looks like a URL is
 * passed through untouched, so a link to an ordinary image on the open web
 * works too — it just doesn't get renditions. Anything that isn't a URL at all
 * (a note to self, a half-pasted link) returns null and the tile shows its
 * placeholder rather than a broken image.
 */
export function resolveImage(link: string): ResolvedImage | null {
  const trimmed = link.trim();
  if (!trimmed) return null;

  const id = driveFileId(trimmed);
  if (id) {
    return {
      src: driveImage(id, 800),
      srcSet: driveSrcSet(id),
      full: driveImage(id, FULL_WIDTH),
      retry: driveImageFallback(id, 1200),
    };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return { src: trimmed, full: trimmed };
  }
  return null;
}
