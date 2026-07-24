/** Single source of truth for paths, nav labels and document titles. */

export interface RouteDef {
  path: string;
  /** Label in the header nav. Omitted for pages that only appear elsewhere. */
  navLabel?: string;
  /** Label in the mobile menu and footer, where there is room for the long form. */
  longLabel: string;
  /** <title> is `${title} · Bundsgård`, except on the front page. */
  title: string;
}

export type RouteKey =
  | 'forside'
  | 'om'
  | 'hverdagen'
  | 'vaerdier'
  | 'ommig'
  | 'praktisk'
  | 'galleri'
  | 'kontakt';

export const routes: Record<RouteKey, RouteDef> = {
  forside: { path: '/', longLabel: 'Forside', title: 'Forside' },
  om: {
    path: '/om-bundsgaard',
    navLabel: 'Om Bundsgård',
    longLabel: 'Om Bundsgård',
    title: 'Om Bundsgård',
  },
  hverdagen: {
    path: '/hverdagen',
    navLabel: 'Hverdagen',
    longLabel: 'Hverdagen',
    title: 'Hverdagen',
  },
  vaerdier: {
    path: '/vaerdier',
    navLabel: 'Værdier',
    longLabel: 'Værdier og pædagogik',
    title: 'Værdier og pædagogik',
  },
  ommig: { path: '/om-mig', navLabel: 'Om mig', longLabel: 'Om mig', title: 'Om mig' },
  praktisk: {
    path: '/praktisk',
    navLabel: 'Praktisk',
    longLabel: 'Praktisk information',
    title: 'Praktisk information',
  },
  galleri: {
    path: '/galleri',
    navLabel: 'Galleri',
    longLabel: 'Galleri',
    title: 'Galleri',
  },
  kontakt: { path: '/kontakt', longLabel: 'Kontakt', title: 'Kontakt' },
};

/** Pages that get a link in the desktop header. */
export const primaryNav: RouteKey[] = [
  'om',
  'hverdagen',
  'vaerdier',
  'ommig',
  'praktisk',
  'galleri',
];

/** Everything in the mobile drawer, front page included. */
export const mobileNav: RouteKey[] = ['forside', ...primaryNav];

/** The short list repeated in the footer. */
export const footerNav: RouteKey[] = ['om', 'hverdagen', 'vaerdier', 'galleri'];
