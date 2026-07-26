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
  openingHours: string;
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
  phone: '00 00 00 00',
  phoneHref: '+4500000000',
  email: 'dorte@bundsgaard.dk',
  bestReachedAt: 'Efter kl. 16, når børnene er hentet',
  municipality: 'Egedal Kommune',
  openingHours: 'Man-fre 6.00-15.30',
  ageRange: '0-3 år',
  childCount: 4,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Bundsvej+16+3660+Stenl%C3%B8se',
  availability: 'Venteliste',
  availabilityNote: 'Næste ledige plads forventes til august',
};

export const fullAddress = `${site.street}, ${site.postalCode} ${site.city}`;
