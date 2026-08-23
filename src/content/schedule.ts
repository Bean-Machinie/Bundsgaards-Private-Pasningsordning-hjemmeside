export interface ScheduleEntry {
  time?: string;
  title: string;
  description: string;
}

/** The day's rhythm, shown as a timeline on /hverdagen. */
export const schedule: ScheduleEntry[] = [
  {
    time: '5.45 – 8.00',
    title: 'God morgen',
    description:
      'Børnene kommer stille og roligt. Der er tid til at sidde på skødet lidt, før dagen går i gang.',
  },
  {
    title: 'Morgenmad',
    description:
      'Havregrød eller brød ved det store bord. Vi venter på hinanden og siger værsgo.',
  },
  {
    time: '9.00',
    title: 'Ud af huset',
    description: 'Haven, markvejen eller en tur til hestene.',
  },
  {
    time: '11.00',
    title: 'Frokost',
    description:
      'Hjemmelavet mad, som vi spiser sammen. Alle får lov at prøve selv, også når det bliver grisset.',
  },
  {
    time: '11.45 – 14.30',
    title: 'Lur',
    description:
      'Der bliver sovet i krybber udenfor. Er man vågen, er der ro, bøger og en voksen ved siden af.',
  },
  {
    time: '14.30',
    title: 'Eftermiddagsmad',
    description:
      'Frugt og brød. Bagefter er der leg, ofte i haven, indtil de første bliver hentet.',
  },
  {
    time: '15.00 – 15.30',
    title: 'Farvel',
    description:
      'Jeg fortæller, hvordan dagen gik. Hvis I kommer i god tid giver jeg gerne en kop kaffe eller te.',
  },
];

export interface Highlight {
  title: string;
  description: string;
}

/**
 * The things that recur, shown under the timeline. Deliberately not pinned to
 * named weekdays — they happen when the weather, the mood and the day suit them.
 */
export const highlights: Highlight[] = [
  {
    title: 'Bagedag',
    description:
      'Vi rører en dej, når der er tid til det. De mindste får en klump at ælte, og køkkenet dufter resten af dagen.',
  },
  {
    title: 'Den lange tur',
    description:
      'Madpakker med og af sted til skoven eller hestene. Vi tager den, når vejret og humøret er til det - hjem til lur som altid.',
  },
  {
    title: 'Vand og farver',
    description:
      'Maling, vand, sæbebobler - noget der må spildes. Vi gør det udenfor, når det kan lade sig gøre.',
  },
  {
    title: 'Lege og motorik',
    description: 'Forhindringsbane, rytmik, ballon-volley, gemmeleg',
  },
  {
    title: 'Hønsene og haven',
    description:
      'Æg skal samles og bedet vandes og plantes. Det er et lille job, og børnene tager det alvorligt. Vi går også på krible-krablejagt.',
  },
];
