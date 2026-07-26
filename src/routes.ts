/** Single source of truth for paths, nav labels and document titles. */

import type { ComponentType } from 'react';

import { HeartIcon, HouseIcon, UserIcon } from './components/Icons';

export interface RouteDef {
  path: string;
  /** Label in the header nav and dropdown. Omitted for pages that only appear elsewhere. */
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
  | 'galleri';

export const routes: Record<RouteKey, RouteDef> = {
  forside: { path: '/', longLabel: 'Forside', title: 'Forside' },
  om: {
    path: '/om-bundsgaard',
    navLabel: 'Stedet',
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
};

/** A page inside a dropdown, with an optional small leading icon. */
export interface NavMenuEntry {
  route: RouteKey;
  Icon?: ComponentType<{ size?: number; className?: string }>;
}

/** A header nav entry: either a page link or a labelled dropdown of pages.
 *  Menus carry their own `id` (for open-state tracking) and `label` (the
 *  trigger text) because neither belongs to any single route. */
export type NavItem =
  | { kind: 'link'; route: RouteKey }
  | { kind: 'menu'; id: string; label: string; items: NavMenuEntry[] };

/** The desktop header. Adding a page is one entry here; grouping pages under
 *  a dropdown is one `menu` entry. */
export const primaryNav: NavItem[] = [
  {
    kind: 'menu',
    id: 'om',
    label: 'Om Bundsgård',
    items: [
      { route: 'om', Icon: HouseIcon },
      { route: 'ommig', Icon: UserIcon },
      { route: 'vaerdier', Icon: HeartIcon },
    ],
  },
  { kind: 'link', route: 'hverdagen' },
  { kind: 'link', route: 'praktisk' },
  { kind: 'link', route: 'galleri' },
];

/** The mobile menu card. No Forside entry — the logo already links home.
 *  Menus render as a group label with their pages indented beneath it. */
export const mobileNav: NavItem[] = primaryNav;

/** The flat list repeated in the footer. */
export const footerNav: RouteKey[] = [
  'om',
  'ommig',
  'vaerdier',
  'hverdagen',
  'praktisk',
  'galleri',
];
