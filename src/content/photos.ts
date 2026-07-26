/**
 * Photo registry.
 *
 * Every picture on the site is named here and resolved from local files in
 * `src/assets/` (via the `stock` barrel) — no external image hosts. `<ImageSlot>`
 * renders the photo when an entry has a `src`, and a labelled placeholder
 * describing the wanted picture when `src` is null.
 *
 * To use a caretaker's own photography: drop the file in `src/assets/images/`,
 * import it in `src/assets/stock.ts`, and reference it here — or replace a file
 * in place, keeping its import name.
 */

import { stock } from '../assets/stock';

export interface Photo {
  /** What the photo should show — visible in the placeholder when src is null. */
  placeholder: string;
  /** Resolved asset URL, or null to render the placeholder. */
  src: string | null;
  /** Alt text. Required once src is set; ignored while it's null. */
  alt?: string;
}

export const photos = {
  day1: {
    placeholder: 'Morgen ved køkkenbordet',
    src: stock.arrivalHug,
    alt: 'Lille barn bliver båret på armen ved ankomst',
  },
  day2: {
    placeholder: 'Tur på markvejen',
    src: stock.leafWagon,
    alt: 'Barn samler efterårsblade i en trækvogn i haven',
  },
  day3: {
    placeholder: 'Frokost, hjemmelavet mad',
    src: stock.lunchTable,
    alt: 'To små børn spiser frokost ved bordet',
  },
  day4: {
    placeholder: 'Barnevogne i haven',
    src: stock.napping,
    alt: 'Sovende barn under en hvid dyne',
  },

  // No photograph of the actual caretaker exists yet, so these stay as
  // placeholders rather than misrepresenting Dorte with a stock child.
  // TODO: indsæt et rigtigt portrætfoto af Dorte.
  dorte: {
    placeholder: 'Portræt af Dorte — gerne udendørs',
    src: null,
  },
  dorteFull: {
    placeholder: 'Portræt af Dorte',
    src: null,
  },

  omHero: {
    placeholder: 'Huset set fra haven',
    src: stock.tallGrass,
    alt: 'Barn på vej mod skovkanten gennem højt græs',
  },
  om1: {
    placeholder: 'Entré med gummistøvler',
    src: stock.leaf,
    alt: 'Barn, der undersøger et blad',
  },
  om2: {
    placeholder: 'Legerummet',
    src: stock.explorers,
    alt: 'To børn på opdagelse med kikkert ved et træ',
  },
  om3: {
    placeholder: 'Hønsegården',
    src: stock.pointingSky,
    alt: 'Barn, der peger op mod himlen i haven',
  },
  om4: {
    placeholder: 'Markvejen',
    src: stock.goldenRun,
    alt: 'To børn løber gennem en solbeskinnet skov',
  },

  hverdag1: {
    placeholder: 'Leg i legerummet',
    src: stock.twoBoys,
    alt: 'To små drenge i efterårsskoven',
  },
  hverdag2: {
    placeholder: 'Ved frokostbordet',
    src: stock.leaf,
    alt: 'Barn, der dufter til et blad',
  },
  hverdag3: {
    placeholder: 'Maling ved bordet',
    src: stock.autumnGirl,
    alt: 'Barn i efterårslys',
  },
} satisfies Record<string, Photo>;

export interface GalleryItem extends Photo {
  caption: string;
  /** CSS aspect-ratio for the frame. */
  ratio: string;
}

export const gallery: GalleryItem[] = [
  {
    placeholder: 'Bredt billede: morgen i haven',
    src: stock.goldenRun,
    alt: 'To børn løber gennem en solbeskinnet skov',
    caption:
      'Mandag morgen. Det tager tyve minutter at komme ud af døren, og det er helt fint.',
    ratio: '16 / 8',
  },
  {
    placeholder: 'Hænder i sandkassen',
    src: stock.twoBoys,
    alt: 'To små drenge i efterårsskoven',
    caption: 'Haven er vores første rum.',
    ratio: '4 / 5',
  },
  {
    placeholder: 'Frokostbordet oppefra',
    src: stock.sticks,
    alt: 'To børn undersøger grene på en skovsti',
    caption: 'Vi undersøger det, vi finder.',
    ratio: '1 / 1',
  },
  {
    placeholder: 'Barnevogne under træet',
    src: stock.handsBw,
    alt: 'To små børn går hånd i hånd (sort-hvid)',
    caption: 'Hånd i hånd, hele vejen.',
    ratio: '4 / 5',
  },
  {
    placeholder: 'På tur ad markvejen',
    src: stock.meadowWalk,
    alt: 'To børn går hånd i hånd over en eng',
    caption: 'Onsdagsturen. Vi når sjældent så langt, som vi havde tænkt.',
    ratio: '3 / 2',
  },
];
