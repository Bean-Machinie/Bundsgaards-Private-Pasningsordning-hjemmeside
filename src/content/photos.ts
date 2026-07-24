/**
 * Photo registry.
 *
 * The photos come from the "Website UI/UX for Daycare" design, which sources
 * them from Unsplash (see ATTRIBUTIONS in the README) and hotlinks the Unsplash
 * CDN — the same approach the source design uses. `unsplash(id, w, h)` builds a
 * cropped, auto-formatted URL.
 *
 * To swap in your own photography, drop files in `public/images/` and replace
 * a `src` with '/images/<file>.jpg'. `<ImageSlot>` renders a labelled
 * placeholder for any entry whose `src` is null, so a half-finished registry
 * still reads as intentional. `alt` is required wherever `src` is set.
 */

const unsplash = (id: string, w: number, h: number): string =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=83`;

export interface Photo {
  /** What the photo should show — visible in the placeholder when src is null. */
  placeholder: string;
  /** URL or public path. Null renders the placeholder instead. */
  src: string | null;
  /** Alt text. Required once src is set; ignored while it's null. */
  alt?: string;
}

export const photos = {
  hero: {
    placeholder: 'Hero: barn og voksen udenfor ved huset',
    src: unsplash('photo-1663162845470-7d18bbde9d5e', 1000, 1400),
    alt: 'Voksen og barn udforsker naturen sammen',
  },

  day1: {
    placeholder: 'Morgen ved køkkenbordet',
    src: unsplash('photo-1772442364639-20fe5e5438a1', 720, 960),
    alt: 'Lyst, hyggeligt køkken om morgenen',
  },
  day2: {
    placeholder: 'Tur på markvejen',
    src: unsplash('photo-1504697575567-a022cf09110a', 720, 960),
    alt: 'Børn på tur langs en faldet træstamme',
  },
  day3: {
    placeholder: 'Frokost, hjemmelavet mad',
    src: unsplash('photo-1663162960517-63364782fcec', 720, 960),
    alt: 'Kurv med friske råvarer',
  },
  day4: {
    placeholder: 'Barnevogne i haven',
    src: unsplash('photo-1560435682-c9d22453e95f', 720, 960),
    alt: 'Blomst i det grønne',
  },

  dorte: {
    placeholder: 'Portræt af Dorte — gerne udendørs',
    src: unsplash('photo-1783774044351-29334596b26a', 900, 900),
    alt: 'Dorte, dagplejer ved Bundsgård, udendørs',
  },
  dorteFull: {
    placeholder: 'Portræt af Dorte',
    src: unsplash('photo-1783774044351-29334596b26a', 720, 900),
    alt: 'Dorte, dagplejer ved Bundsgård',
  },

  omHero: {
    placeholder: 'Huset set fra haven',
    src: unsplash('photo-1736667227621-a4e5cd08d866', 1400, 620),
    alt: 'Det hyggelige hjem set udefra',
  },
  om1: {
    placeholder: 'Entré med gummistøvler',
    src: unsplash('photo-1519226135464-df5a9dbcd2a5', 720, 720),
    alt: 'Barn på gynge i haven',
  },
  om2: {
    placeholder: 'Legerummet',
    src: unsplash('photo-1510125750144-795c2b0737ba', 720, 720),
    alt: 'Hænder, der udforsker blade fra naturen',
  },
  om3: {
    placeholder: 'Hønsegården',
    src: unsplash('photo-1658063678892-273048070d01', 720, 720),
    alt: 'Lille barn, der sidder i græsset',
  },
  om4: {
    placeholder: 'Markvejen',
    src: unsplash('photo-1617818193486-bb16d2ccceaf', 720, 720),
    alt: 'Barn i det grønne',
  },

  hverdag1: {
    placeholder: 'Leg i legerummet',
    src: unsplash('photo-1519226135464-df5a9dbcd2a5', 720, 900),
    alt: 'Barn på gynge i haven',
  },
  hverdag2: {
    placeholder: 'Ved frokostbordet',
    src: unsplash('photo-1772442364639-20fe5e5438a1', 720, 720),
    alt: 'Lyst køkken om morgenen',
  },
  hverdag3: {
    placeholder: 'Maling ved bordet',
    src: unsplash('photo-1510125750144-795c2b0737ba', 720, 720),
    alt: 'Hænder med blade fra naturen',
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
    src: unsplash('photo-1663162845470-7d18bbde9d5e', 1400, 700),
    alt: 'Voksen og barn med kurv i naturen',
    caption:
      'Mandag morgen. Det tager tyve minutter at komme ud af døren, og det er helt fint.',
    ratio: '16 / 8',
  },
  {
    placeholder: 'Hænder i sandkassen',
    src: unsplash('photo-1519226135464-df5a9dbcd2a5', 720, 900),
    alt: 'Barn på gynge i haven',
    caption: 'Haven er vores første rum.',
    ratio: '4 / 5',
  },
  {
    placeholder: 'Frokostbordet oppefra',
    src: unsplash('photo-1772442364639-20fe5e5438a1', 720, 720),
    alt: 'Morgenlys i køkkenet',
    caption: 'En stille morgen.',
    ratio: '1 / 1',
  },
  {
    placeholder: 'Barnevogne under træet',
    src: unsplash('photo-1617818193486-bb16d2ccceaf', 720, 900),
    alt: 'Fri leg i det fri',
    caption: 'Lur udenfor, året rundt.',
    ratio: '4 / 5',
  },
  {
    placeholder: 'På tur ad markvejen',
    src: unsplash('photo-1504697575567-a022cf09110a', 1040, 700),
    alt: 'Børn på en faldet træstamme i skoven',
    caption: 'Onsdagsturen. Vi når sjældent så langt, som vi havde tænkt.',
    ratio: '3 / 2',
  },
];
