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
      'Hos os er der kun fire børn, hjemlige rammer og god tid til at se det enkelte barn.',
    ctaLabel: 'Kontakt os',
    ctaTo: 'contact',
  },
  {
    image: stock.natureToddler,
    alt: 'Lille barn sidder i græsset og undersøger planterne omkring sig',
    headline: 'Naturen er vores ',
    highlight: 'andet hjem',
    subtext:
      'Vi bruger haven, marken og skovstien som en naturlig del af hverdagen, i al slags vejr.',
    ctaLabel: 'Se hverdagen',
    ctaTo: 'hverdagen',
  },
  {
    image: stock.pinecones,
    alt: 'Lille barn, der samler grankogler i skovbunden',
    headline: 'Tid til de små ',
    highlight: 'opdagelser',
    subtext:
      'Her er der tid til at stoppe op, være nysgerrig og undersøge det, barnet finder på sin vej.',
    ctaLabel: 'Læs om værdierne',
    ctaTo: 'vaerdier',
  },
  {
    image: stock.sticks,
    alt: 'To børn undersøger grene på en skovsti',
    headline: 'Den samme voksne, ',
    highlight: 'hver morgen',
    subtext:
      'Ingen vikarer og ingen skiftende stuer, bare trygge rammer og en relation, der får lov at vokse.',
    ctaLabel: 'Om Bundsgård',
    ctaTo: 'om',
  },
];

/** Paths resolved once, so the component stays declarative. */
export const heroCtaPath = (key: RouteKey, anchor?: string): string =>
  anchor ? `${routes[key].path}#${anchor}` : routes[key].path;
