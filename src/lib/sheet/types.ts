import type { Faq } from '../../content/faqs';
import type { GalleryItem } from '../../content/photos';
import type { PracticalNote, SpecPanel } from '../../content/practical';
import type { OpeningRow } from '../../content/site';

/** The front-page wax seal's imprint. One array entry per line — the seal
 *  fits the block to its disc itself, and short lines let it fit larger. */
export interface Stamp {
  lines: string[];
  sublines: string[];
}

/** Everything the sheet can drive, resolved and ready to render. */
export interface SiteData {
  /** The cards on the Praktisk page, in sheet order. */
  cards: SpecPanel[];
  /** The rows of `cards` whose value is a time span — the hours proper, read
   *  by the footer and the front-page strip as well as by the card. */
  openingHours: OpeningRow[];
  notes: PracticalNote[];
  faqs: Faq[];
  gallery: GalleryItem[];
  /** null when the caretaker cleared the month — the seal isn't rendered. */
  stamp: Stamp | null;
}

/**
 * What one sheet actually said.
 *
 * Every field is optional, and the difference between the two empty states is
 * the whole safety model:
 *
 *   `undefined` — the block isn't in the sheet. Nothing was said, so the
 *                 previous value stands.
 *   `[]`/`null` — the block is there and the caretaker emptied it. That is an
 *                 instruction, and the page shows its empty state.
 *
 * Which is why a sheet that hasn't been filled in yet, or a fetch that comes
 * back truncated, can never blank the site: an absent block changes nothing.
 */
export type SheetContent = Partial<SiteData>;

export type SheetStatus =
  /** Rendering real content — from the sheet, the cache or the snapshot. */
  | 'ready'
  /** Nothing to render yet; the skeletons are up. */
  | 'loading'
  /** No content and the fetch failed. Skeletons give way to empty states. */
  | 'error';

/** Where the content on screen came from. Diagnostics only — nothing renders
 *  differently — but it is the first thing worth knowing when a change in the
 *  sheet hasn't appeared. */
export type SheetSource = 'snapshot' | 'cache' | 'network';
