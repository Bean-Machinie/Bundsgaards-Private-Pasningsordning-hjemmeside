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

  // The three tiles of the mosaic on the Om-page, in layout order: the square,
  // the upright beside it, the wide one underneath. Each is cropped hard by its
  // tile, so the subject sits near the middle of every frame.
  omSquare: {
    placeholder: 'Huset set fra haven',
    src: stock.gaardHouse,
    alt: 'Det stråtækte hus set langs facaden med græsplænen og de gamle træer',
  },
  omTall: {
    placeholder: 'Bøgetræet i haven',
    src: stock.gaardBeech,
    alt: 'Stort bøgetræ i efterårsfarver med hunden stående nedenunder',
  },
  omWide: {
    placeholder: 'Morgen ud over marken',
    src: stock.gaardMorning,
    alt: 'Frostklar morgen med solen gennem træerne og en kop kaffe i hånden',
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
  /** Sits on the photo itself, bottom left, and names the tile's open button. */
  caption: string;
}

/**
 * The gallery, in mosaic order.
 *
 * The Galleri page lays these out in seven-tile blocks that alternate between
 * two mirrored arrangements (see `TILE_PATTERN` in pages/Galleri.tsx). A photo's
 * position therefore decides both its shape and how it gets cropped, so the
 * order below is chosen to match each picture: the portrait photographs sit in
 * the upright slots, the widest landscapes in the wide ones, and the photos that
 * can carry a long caption sit in the big squares.
 *
 * The slots, in order — block A: big square, upright, small, small, wide, small,
 * small. Block B: small, upright, big square, small, small, small, wide.
 *
 * Keep the length a multiple of seven so every block comes out whole (fourteen
 * to end on a complete pair), and when reordering, move photos between slots of
 * the same shape.
 */
export const gallery: GalleryItem[] = [
  // ── Block one ────────────────────────────────────────────────────────────
  {
    placeholder: 'Morgen i haven',
    src: stock.goldenRun,
    alt: 'To børn løber gennem en solbeskinnet skov',
    caption:
      'Mandag morgen. Det tager tyve minutter at komme ud af døren, og det er helt fint.',
  },
  {
    placeholder: 'Leg i skovkanten',
    src: stock.twoBoys,
    alt: 'To små drenge i efterårsskoven',
    caption: 'Haven er vores første rum.',
  },
  {
    placeholder: 'Fund på skovstien',
    src: stock.sticks,
    alt: 'To børn undersøger grene på en skovsti',
    caption: 'Vi undersøger det, vi finder.',
  },
  {
    placeholder: 'Frokostbordet',
    src: stock.lunchTable,
    alt: 'To små børn spiser frokost ved bordet',
    caption: 'Frokost ved det samme bord som altid.',
  },
  {
    placeholder: 'På tur ad markvejen',
    src: stock.meadowWalk,
    alt: 'To børn går hånd i hånd over en eng',
    caption: 'Onsdagsturen. Vi når sjældent så langt, som vi havde tænkt.',
  },
  {
    placeholder: 'Blade i trækvognen',
    src: stock.leafWagon,
    alt: 'Barn samler efterårsblade i en trækvogn i haven',
    caption: 'Blade nok til hele trækvognen.',
  },
  {
    placeholder: 'Nærbillede af et blad',
    src: stock.leaf,
    alt: 'Barn, der dufter til et blad',
    caption: 'Alting skal lugtes til først.',
  },

  // ── Block two — mirrored, so the small tile comes first ───────────────────
  {
    placeholder: 'Middagslur',
    src: stock.napping,
    alt: 'Sovende barn under en hvid dyne',
    caption: 'Der bliver sovet.',
  },
  {
    placeholder: 'Hånd i hånd',
    src: stock.handsBw,
    alt: 'To små børn går hånd i hånd (sort-hvid)',
    caption: 'Hånd i hånd, hele vejen.',
  },
  {
    placeholder: 'På opdagelse ved træet',
    src: stock.explorers,
    alt: 'To børn på opdagelse med kikkert ved et træ',
    caption: 'Ekspedition til hækken. Kikkerten er det vigtigste udstyr.',
  },
  {
    placeholder: 'Eftermiddag i efterårslys',
    src: stock.autumnGirl,
    alt: 'Barn i efterårslys',
    caption: 'Eftermiddagslys.',
  },
  {
    placeholder: 'Buket fra vejkanten',
    src: stock.wildflowers,
    alt: 'Barn med en buket markblomster',
    caption: 'Buketter til køkkenbordet.',
  },
  {
    placeholder: 'Grankogler i lommen',
    src: stock.pinecones,
    alt: 'Lille barn med grankogler i hænderne',
    caption: 'Grankogler kommer med hjem i lommen.',
  },
  {
    placeholder: 'Ned mod skovkanten',
    src: stock.tallGrass,
    alt: 'Barn på vej mod skovkanten gennem højt græs',
    caption: 'Ned ad markvejen — i regntøj, hvis det skal være.',
  },
];
