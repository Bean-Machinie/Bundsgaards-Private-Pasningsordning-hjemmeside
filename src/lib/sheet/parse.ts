/**
 * The sheet's grammar.
 *
 * One tab, three columns, and blocks introduced by a `#` in the first column:
 *
 *     # ÅBNINGSTIDER
 *     Mandag – torsdag   6.00 – 15.30
 *     Fredag             6.00 – 15.00
 *     Weekend            Lukket          Dæmpet
 *     Fodnote            Har I brug for …
 *
 * Everything about the format is chosen so that the person editing it can't
 * break the site by editing it wrong:
 *
 *   · A block the sheet doesn't mention leaves that part of the site alone —
 *     so an empty sheet, a half-written one, or a fetch that arrives truncated
 *     all render the last good content instead of a blank page.
 *   · A block that *is* there and has no rows is an instruction, and the page
 *     shows its empty state. That is how "the holiday dates aren't settled
 *     yet" is expressed: delete the rows, keep the block.
 *   · Names are matched loosely (see `fold`) — case, accents and stray spaces
 *     don't matter.
 *   · Anything above the first `#` is ignored, so the top of the sheet is free
 *     for a title and a note to whoever is editing it.
 *   · A block name the parser doesn't recognise becomes a card on the Praktisk
 *     page, titled with that name. Adding a card is adding a block.
 *
 * The reserved block names are below; everything else is a card.
 */

import type { Faq } from '../../content/faqs';
import type { GalleryItem } from '../../content/photos';
import type { PracticalNote, SpecPanel, SpecRow } from '../../content/practical';
import type { OpeningRow } from '../../content/site';
import { cell, fold, parseCsv } from './csv';
import { resolveImage } from './drive';
import type { SheetContent, Stamp } from './types';

/* ── The vocabulary ──────────────────────────────────────────────────────
   All folded (lowercase, accents removed), because that is what they are
   compared against. Several spellings per concept: the caretaker should be
   able to write the heading the way she'd say it. */

const BLOCK_STAMP = ['stempel'];
const BLOCK_NOTES = ['godt at vide', 'noter'];
const BLOCK_FAQ = ['sporgsmal og svar', 'ofte stillede sporgsmal', 'faq'];
const BLOCK_GALLERY = ['billeder', 'galleri'];

/** Row labels inside a card that are settings rather than rows of their own. */
const CARD_TITLE = ['titel', 'overskrift'];
const CARD_INTRO = ['intro', 'indledning'];
const CARD_FOOTNOTE = ['fodnote', 'note'];
const CARD_EMPTY = ['tom tekst', 'tekst nar tom'];

/** Row labels inside `# STEMPEL`. */
const STAMP_TEXT = ['tekst', 'linje', 'linjer'];
const STAMP_DATE = ['maned og ar', 'maned', 'dato'];

/** Third-column flags that mute a row's value. */
const MUTED = ['daempet', 'muted', 'ja', 'x'];

/** The opening-hours card's key, and the identity the footer looks it up by. */
export const OPENING_HOURS_KEY = 'abningstider';

/**
 * A value that is a span of clock times — "6.00 – 15.30".
 *
 * This is what separates an hours row from the other rows in the same card:
 * "Weekend / Lukket" belongs on the Praktisk page but is not an opening time,
 * and printing it in the footer's hours column would be a lie. Write a real
 * span there instead and the footer picks it up — which is the correct
 * behaviour if the weekend ever opens.
 */
const TIME_SPAN = /^(\d{1,2}[.:]\d{2})\s*[–—-]\s*(\d{1,2}[.:]\d{2})$/;

const includesFolded = (list: string[], value: string) => list.includes(value);

/* ── Blocks ──────────────────────────────────────────────────────────────── */

interface Block {
  /** The name as typed, which is also a card's title. */
  name: string;
  /** The folded name, for matching. */
  key: string;
  rows: string[][];
}

/** Cut the grid into blocks at each `#` in the first column. */
function toBlocks(grid: string[][]): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const row of grid) {
    const first = cell(row, 0);

    if (first.startsWith('#')) {
      const name = first.slice(1).trim();
      // A bare `#` closes the block above without opening a new one, which is
      // a harmless way to leave a gap.
      current = name ? { name, key: fold(name), rows: [] } : null;
      if (current) blocks.push(current);
      continue;
    }

    if (!current) continue;
    // Wholly blank rows are spacing, not data — the sheet should be allowed to
    // breathe between blocks.
    if (row.every((value) => value.trim() === '')) continue;
    current.rows.push(row);
  }

  return blocks;
}

/* ── Block readers ───────────────────────────────────────────────────────── */

function readCard(block: Block): SpecPanel {
  const card: SpecPanel = { key: block.key, title: block.name, rows: [] };

  for (const row of block.rows) {
    const label = cell(row, 0);
    const value = cell(row, 1);
    const flag = fold(cell(row, 2));
    const labelKey = fold(label);

    if (includesFolded(CARD_TITLE, labelKey)) {
      if (value) card.title = value;
      continue;
    }
    if (includesFolded(CARD_INTRO, labelKey)) {
      if (value) card.intro = value;
      continue;
    }
    if (includesFolded(CARD_FOOTNOTE, labelKey)) {
      if (value) card.footnote = value;
      continue;
    }
    if (includesFolded(CARD_EMPTY, labelKey)) {
      if (value) card.emptyText = value;
      continue;
    }

    // A label with nothing beside it is half-typed, not a row.
    if (!label || !value) continue;
    card.rows.push(includesFolded(MUTED, flag) ? { label, value, muted: true } : { label, value });
  }

  return card;
}

function readNotes(block: Block): PracticalNote[] {
  return block.rows
    .map((row) => ({ title: cell(row, 0), body: cell(row, 1) }))
    .filter((note) => note.title && note.body);
}

function readFaqs(block: Block): Faq[] {
  return block.rows
    .map((row) => ({ question: cell(row, 0), answer: cell(row, 1) }))
    .filter((faq) => faq.question && faq.answer);
}

function readGallery(block: Block): GalleryItem[] {
  const items: GalleryItem[] = [];

  for (const row of block.rows) {
    const image = resolveImage(cell(row, 0));
    // Skips the column labels the template puts on the header row, a note the
    // caretaker left herself, and a link that was pasted in half.
    if (!image) continue;

    const caption = cell(row, 1);
    const alt = cell(row, 2);
    items.push({
      placeholder: caption || 'Billede fra Bundsgård',
      caption,
      // Alt text is what a screen reader reads and the caption is what everyone
      // else does; when only one is given it has to serve both.
      alt: alt || caption,
      src: image.src,
      srcSet: image.srcSet,
      full: image.full,
      retry: image.retry,
    });
  }

  return items;
}

/** Words become lines. The seal fits its imprint to the disc itself, and it
 *  can set the block larger the narrower its widest line is — so "August 2027"
 *  is pressed as two stacked words, exactly as it was when it was hard-coded. */
const toLines = (value: string): string[] => value.split(/\s+/).filter(Boolean);

function readStamp(block: Block): Stamp | null {
  let lines: string[] = [];
  let sublines: string[] = [];

  for (const row of block.rows) {
    const labelKey = fold(cell(row, 0));
    const value = cell(row, 1);
    if (includesFolded(STAMP_TEXT, labelKey)) lines = toLines(value);
    else if (includesFolded(STAMP_DATE, labelKey)) sublines = toLines(value);
  }

  // The month is the switch: clear that one cell and the seal is gone from the
  // front page entirely — not faded, not empty, not rendered.
  if (sublines.length === 0) return null;
  return { lines: lines.length > 0 ? lines : ['Ledige', 'pladser'], sublines };
}

/* ── The whole sheet ─────────────────────────────────────────────────────── */

/** The hours rows of a card — those whose value is a clock span. */
function toOpeningRows(rows: SpecRow[]): OpeningRow[] {
  const hours: OpeningRow[] = [];
  for (const row of rows) {
    const match = TIME_SPAN.exec(row.value.trim());
    if (match) hours.push({ days: row.label, opens: match[1], closes: match[2] });
  }
  return hours;
}

/**
 * One CSV export → what it said.
 *
 * Only blocks that are actually present come back set; see `SheetContent` for
 * why that distinction carries the site's safety.
 */
export function parseSheet(csv: string): SheetContent {
  const blocks = toBlocks(parseCsv(csv));
  const content: SheetContent = {};
  const cards: SpecPanel[] = [];
  let sawCard = false;

  for (const block of blocks) {
    if (includesFolded(BLOCK_STAMP, block.key)) {
      content.stamp = readStamp(block);
      continue;
    }
    if (includesFolded(BLOCK_NOTES, block.key)) {
      content.notes = readNotes(block);
      continue;
    }
    if (includesFolded(BLOCK_FAQ, block.key)) {
      content.faqs = readFaqs(block);
      continue;
    }
    if (includesFolded(BLOCK_GALLERY, block.key)) {
      // The one block where "present but empty" is *not* taken as an
      // instruction. A holiday card can meaningfully have nothing in it; a
      // gallery can't — an empty photo page is a broken photo page, and the
      // likeliest reasons to find no usable links here are a block written
      // ahead of the photos and a link pasted in half. So it keeps whatever it
      // was showing, and the page is never bare.
      const items = readGallery(block);
      if (items.length > 0) content.gallery = items;
      continue;
    }
    sawCard = true;
    cards.push(readCard(block));
  }

  if (sawCard) {
    // Any card at all means the sheet is describing the Praktisk page, so it
    // describes all of it: the hours follow the cards, and a sheet that no
    // longer has an hours card no longer has opening hours to print.
    content.cards = cards;
    const hours = cards.find((card) => card.key === OPENING_HOURS_KEY);
    content.openingHours = hours ? toOpeningRows(hours.rows) : [];
  }

  /* The seal is the one thing the "an absent block leaves it alone" rule must
     not cover. Everything else here is durable — an out-of-date opening hour is
     wrong, but it is still an opening hour. The seal is an announcement, and a
     stale one actively misleads: a family reading "Ledige pladser · august" on
     a page that simply hasn't been told otherwise is worse off than one that
     sees no seal at all.

     So for the seal, a sheet we understood at all is the authority. No block,
     no seal — the same answer an emptied month gives. Last, so that a sheet
     carrying nothing but cards still counts as understood. */
  if (Object.keys(content).length > 0 && content.stamp === undefined) {
    content.stamp = null;
  }

  return content;
}

/**
 * Is this response worth believing?
 *
 * A published sheet that has been emptied, renamed or unshared doesn't fail —
 * it answers 200 with nothing, or with a login page. Neither is a reason to
 * throw away content that is on screen and correct, so a response has to name
 * at least one block before it is allowed to replace anything.
 */
export function isUsable(csv: string): boolean {
  if (csv.trim() === '') return false;
  if (/^\s*</.test(csv)) return false; // an HTML error page, not a CSV
  const content = parseSheet(csv);
  return Object.keys(content).length > 0;
}

/** Merge what a sheet said over what the site already had. */
export function applySheet<T extends SheetContent>(base: T, sheet: SheetContent): T {
  return { ...base, ...sheet };
}
