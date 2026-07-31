/**
 * The shapes the Praktisk page is built from.
 *
 * The content itself — every card, every row, every note — comes from the
 * Google Sheet (see src/lib/sheet). This file holds the types those rows are
 * parsed into, and the one piece of front-page prose that has to be *derived*
 * from the hours rather than written out: the headline strip.
 */

import { hoursOf, type OpeningRow } from './site';

export interface SpecRow {
  label: string;
  value: string;
  /** Renders the value in muted ink — for "Lukket", "Oplyses ved kontakt" etc. */
  muted?: boolean;
}

/**
 * One card on the Praktisk page.
 *
 * A card comes from one `# …` block in the sheet, and the block's name is the
 * card's title — so adding a card is adding a block, and the page follows.
 */
export interface SpecPanel {
  /** Folded block name, e.g. `Åbningstider` → `abningstider`. Identifies the
   *  opening-hours card, which the footer and the front page also read. */
  key: string;
  title: string;
  intro?: string;
  rows: SpecRow[];
  footnote?: string;
  /** Shown in place of the rows when the caretaker has emptied the card —
   *  holidays that aren't settled yet, a price not published. */
  emptyText?: string;
}

export interface PracticalNote {
  title: string;
  body: string;
}

export interface Fact {
  value: string;
  label: string;
}

/** The days column reads as a range — "Mandag – torsdag" — but inside a
 *  sentence the dash has to become a word. */
function asProse(row: OpeningRow): string {
  return row.days.toLowerCase().replace(/\s*[–—-]\s*/g, ' til ');
}

/**
 * The dot-separated strip of headline facts under the front-page welcome.
 *
 * Each cell is one big value over one small label, so the hours can't be two
 * rows here — the value quotes the week's span and the label carries Friday's
 * earlier close, rather than the strip claiming a single time for all five
 * days. Built from the live rows rather than written out, so a change in the
 * sheet can't leave the front page promising an hour the footer contradicts.
 */
export function headlineFacts(openingHours: OpeningRow[]): Fact[] {
  const [first, second] = openingHours;

  // No hours at all is a legitimate state — the caretaker emptied the block —
  // and the strip simply loses that cell rather than printing an empty one.
  const hours: Fact[] = first
    ? [
        {
          value: hoursOf(first),
          label: second
            ? `${asProse(first)}, ${asProse(second)} til ${second.closes}`
            : asProse(first),
        },
      ]
    : [];

  return [
    { value: '4 børn', label: 'fast lille gruppe' },
    { value: '0-3 år', label: 'til start i børnehave' },
    ...hours,
    { value: 'Udenfor', label: 'hver dag, året rundt' },
  ];
}
