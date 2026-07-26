import { stock } from '../assets/stock';
import { routes, type RouteKey } from '../routes';

export interface HeroSlide {
  image: string;
  alt: string;
  /** Rendered before the highlight; keep the trailing space so they read as
   *  one sentence when they wrap. */
  headline: string;
  /** The emphasised tail of the headline. */
  highlight: string;
  subtext: string;
  ctaLabel: string;
  /** A route key to link to, or 'contact' to scroll to the footer instead. */
  ctaTo: RouteKey | 'contact';
  /** Optional in-page anchor on the target route (without the '#'). */
  ctaAnchor?: string;
}

/** Add a slide by adding an entry — dots, autoplay and looping all follow. */
export const heroSlides: HeroSlide[] = [
  {
    image: stock.goldenRun,
    alt: 'To børn løber gennem en solbeskinnet skov',
    headline: 'Et lille sted at være ',
    highlight: 'lille',
    subtext:
      'Fire børn, ét hjem, og god tid til hver enkelt — hver dag, året rundt.',
    ctaLabel: 'Kontakt',
    ctaTo: 'contact',
  },
  {
    image: stock.explorers,
    alt: 'To børn på opdagelse med kikkert ved et træ',
    headline: 'Naturen er vores ',
    highlight: 'stue nummer to',
    subtext:
      'Have, mark og skovsti ligger lige uden for døren — i al slags vejr.',
    ctaLabel: 'Se hverdagen',
    ctaTo: 'hverdagen',
  },
  {
    image: stock.pinecones,
    alt: 'Lille barn, der samler grankogler i skovbunden',
    headline: 'Tid til at kigge på ',
    highlight: 'en snegl',
    subtext:
      'Vi skal ikke nå så meget. Der er tid til det, der er vigtigt for det enkelte barn.',
    ctaLabel: 'Læs om værdierne',
    ctaTo: 'vaerdier',
  },
  {
    image: stock.sticks,
    alt: 'To børn undersøger grene på en skovsti',
    headline: 'Den samme voksne, ',
    highlight: 'hver morgen',
    subtext:
      'Ingen vikarer, ingen skiftende stuer — bare en relation, der får lov at vokse.',
    ctaLabel: 'Om Bundsgård',
    ctaTo: 'om',
  },
];

/** Paths resolved once, so the component stays declarative. */
export const heroCtaPath = (key: RouteKey, anchor?: string): string =>
  anchor ? `${routes[key].path}#${anchor}` : routes[key].path;
