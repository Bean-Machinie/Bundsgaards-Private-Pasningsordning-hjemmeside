export interface ScheduleEntry {
  time: string;
  title: string;
  description: string;
}

/** The day's rhythm, shown as a timeline on /hverdagen. */
export const schedule: ScheduleEntry[] = [
  {
    time: '6.00 – 8.00',
    title: 'God morgen',
    description:
      'Børnene kommer stille og roligt. Der er tid til at sidde på skødet lidt, før dagen går i gang.',
  },
  {
    time: '7.30',
    title: 'Morgenmad',
    description:
      'Havregrød eller brød ved det store bord. Vi venter på hinanden og siger værsgo.',
  },
  {
    time: '9.00',
    title: 'Ud af huset',
    description:
      'Haven, markvejen eller en tur til hestene. De mindste sover i barnevognen undervejs.',
  },
  {
    time: '11.00',
    title: 'Frokost',
    description:
      'Hjemmelavet mad, som vi spiser sammen. Alle får lov at prøve selv, også når det bliver grisset.',
  },
  {
    time: '11.45 – 14.00',
    title: 'Lur',
    description:
      'Der bliver sovet i barnevogn udenfor. Er man vågen, er der ro, bøger og en voksen ved siden af.',
  },
  {
    time: '14.00',
    title: 'Eftermiddagsmad',
    description:
      'Frugt og brød. Bagefter er der leg — ofte i haven, indtil de første bliver hentet.',
  },
  {
    time: '15.00 – 15.30',
    title: 'Farvel',
    description:
      'Jeg fortæller, hvordan dagen gik. Ikke som en rapport, men som en snak i døren.',
  },
];

export interface WeeklyHighlight {
  day: string;
  title: string;
  description: string;
}

/** The things that recur every week, shown as cards under the timeline. */
export const weeklyHighlights: WeeklyHighlight[] = [
  {
    day: 'Mandag',
    title: 'Bagedag',
    description:
      'Vi rører boller. De mindste får en dej at ælte, og køkkenet dufter resten af dagen.',
  },
  {
    day: 'Onsdag',
    title: 'Den lange tur',
    description:
      'Vi tager madpakker med og går til skoven eller til hestene. Hjem til lur som altid.',
  },
  {
    day: 'Torsdag',
    title: 'Vand og farver',
    description:
      'Maling, dej, sæbevand — noget der må spildes. Vi gør det udenfor, når det er muligt.',
  },
  {
    day: 'Fredag',
    title: 'Hønsene og haven',
    description:
      'Æg skal samles og bedet vandes. Det er et lille job, og børnene tager det alvorligt.',
  },
];
