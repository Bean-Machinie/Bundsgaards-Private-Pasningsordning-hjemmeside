/**
 * Photo registry.
 *
 * The design ships with empty image slots. Each entry below describes the
 * picture that belongs there; `src` is null until a real photo exists. To fill
 * one: drop the file in `public/images/`, then set `src: '/images/<file>.jpg'`
 * and write a proper `alt`. Nothing else has to change — <ImageSlot> renders
 * the labelled placeholder while `src` is null and the photo once it isn't.
 */

export interface Photo {
  /** What the photo should show — visible in the placeholder. */
  placeholder: string;
  /** Public path, e.g. '/images/hero.jpg'. Null until a photo is added. */
  src: string | null;
  /** Alt text. Required once src is set; ignored while it's null. */
  alt?: string;
}

const empty = (placeholder: string): Photo => ({ placeholder, src: null });

export const photos = {
  hero: empty('Hero: børn udenfor ved huset — ustaget, dagslys'),

  day1: empty('Morgen ved køkkenbordet'),
  day2: empty('Tur på markvejen'),
  day3: empty('Frokost, hjemmelavet mad'),
  day4: empty('Barnevogne i haven'),

  dorte: empty('Portræt af Dorte — gerne udendørs'),
  dorteFull: empty('Portræt af Dorte'),

  omHero: empty('Huset set fra haven'),
  om1: empty('Entré med gummistøvler'),
  om2: empty('Legerummet'),
  om3: empty('Hønsegården'),
  om4: empty('Markvejen'),

  hverdag1: empty('Leg i legerummet'),
  hverdag2: empty('Ved frokostbordet'),
  hverdag3: empty('Maling ved bordet'),
} satisfies Record<string, Photo>;

export interface GalleryItem extends Photo {
  caption: string;
  /** CSS aspect-ratio for the frame. */
  ratio: string;
}

export const gallery: GalleryItem[] = [
  {
    ...empty('Bredt billede: morgen i haven'),
    caption:
      'Mandag morgen. Det tager tyve minutter at komme ud af døren, og det er helt fint.',
    ratio: '16 / 8',
  },
  {
    ...empty('Hænder i sandkassen'),
    caption: 'Sandkassen, hele foråret.',
    ratio: '4 / 5',
  },
  {
    ...empty('Frokostbordet oppefra'),
    caption: 'Frokost. Vi spiser det samme.',
    ratio: '1 / 1',
  },
  {
    ...empty('Barnevogne under træet'),
    caption: 'Lur udenfor, året rundt.',
    ratio: '4 / 5',
  },
  {
    ...empty('På tur ad markvejen'),
    caption: 'Onsdagsturen. Vi når sjældent så langt, som vi havde tænkt.',
    ratio: '3 / 2',
  },
];
