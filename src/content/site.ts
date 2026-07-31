/**
 * Site-wide facts. Everything a caretaker would realistically want to change
 * without touching a component lives in this file.
 *
 * TODO: telefonnummeret er stadig en placeholder fra prototypen.
 */

export type Availability = 'Ledige pladser' | 'Én plads ledig' | 'Venteliste';

export interface SiteInfo {
  name: string;
  tagline: string;
  owner: string;
  street: string;
  postalCode: string;
  city: string;
  /** Human-readable, as printed on the page. */
  phone: string;
  /** E.164, for tel: links. */
  phoneHref: string;
  email: string;
  bestReachedAt: string;
  municipality: string;
  ageRange: string;
  childCount: number;
  mapsUrl: string;
  availability: Availability;
  availabilityNote: string;
}

export const site: SiteInfo = {
  name: 'Bundsgård',
  tagline: 'Privat Pasningsordning',
  owner: 'Dorte Thygesen',
  street: 'Bundsvej 16',
  postalCode: '3660',
  city: 'Stenløse',
  phone: '+45 20 87 93 97',
  phoneHref: '+4520879397',
  email: 'dorte@thygesen.mail.dk',
  bestReachedAt: 'Efter kl. 16, når børnene er hentet',
  municipality: 'Egedal Kommune',
  ageRange: '0-3 år',
  childCount: 4,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Bundsvej+16+3660+Stenl%C3%B8se',
  availability: 'Venteliste',
  availabilityNote: 'Næste ledige plads forventes til august',
};

export const fullAddress = `${site.street}, ${site.postalCode} ${site.city}`;

/* ── Opening hours ────────────────────────────────────────────────────────
   Friday closes earlier than the rest of the week, so there is no single
   "mandag – fredag" line that tells the truth: the hours are a *list of rows*,
   and every place on the site that prints them prints the rows.

   The rows themselves are no longer written here — they come from the
   "# ÅBNINGSTIDER" block of the Google Sheet (see src/lib/sheet), so the
   caretaker can change a closing time without a deploy. Read them with
   `useSiteData().openingHours`; this file keeps the shape and the formatting.

   One list, one source. A second copy of a closing time somewhere else is how
   the site ends up promising two different things on two different pages. */

export interface OpeningRow {
  /** The days this row covers, as printed. */
  days: string;
  /** Opening and closing time. Kept apart so the one-line summaries — which
   *  have no room for two rows — can quote a closing time on its own. */
  opens: string;
  closes: string;
}

/** A row's printed span — "6.00 – 15.30". */
export function hoursOf(row: OpeningRow) {
  return `${row.opens} – ${row.closes}`;
}
