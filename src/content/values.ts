export interface Value {
  title: string;
  body: string;
  /** The "I praksis:" line — how the principle looks on an ordinary day. */
  example: string;
}

/** The full pedagogy, shown on /vaerdier. */
export const values: Value[] = [
  {
    title: 'Tryghed er forudsætningen',
    body: 'Et lille barn kan først lære noget, når det føler sig trygt. Derfor bruger jeg lang tid på indkøringen og på at kende jeres barns signaler.',
    example:
      'I praksis: den samme voksne tager imod hver morgen, og vi siger ordentligt farvel — aldrig i smug.',
  },
  {
    title: 'Genkendelige rutiner',
    body: 'Dagen ligner sig selv. Når måltider, lur og ture ligger fast, kan barnet bruge sin energi på at lege i stedet for at gætte, hvad der sker nu.',
    example:
      'I praksis: samme rækkefølge hver dag, og vi fortæller altid, hvad der kommer bagefter.',
  },
  {
    title: 'Plads til det enkelte barn',
    body: 'Fire børn betyder, at jeg kan følge fire forskellige tempi. Den, der lige er begyndt at gå, får noget andet end den, der snart skal i børnehave.',
    example:
      'I praksis: vi venter på den langsomme sko, og vi springer turen over, hvis nogen har brug for en rolig dag.',
  },
  {
    title: 'Naturen hver dag',
    body: 'Vi er ude i al slags vejr. Ude er der plads til høje stemmer og store bevægelser, og børnene sover bedre bagefter.',
    example:
      'I praksis: gummistøvler og regntøj i entréen året rundt — og lur i barnevogn udenfor.',
  },
  {
    title: 'Leg er arbejde',
    body: 'Jeg blander mig ikke i alt. Børn lærer at vente, dele og forhandle, når de får lov at være i legen selv — men jeg er tæt på og hjælper, hvor det er nødvendigt.',
    example: 'I praksis: få aktiviteter på skemaet og lang tid til hver enkelt.',
  },
  {
    title: 'Et tæt samarbejde med jer',
    body: 'I kender jeres barn bedst. Jeg vil hellere spørge en gang for meget, end antage noget forkert.',
    example:
      'I praksis: en snak ved aflevering og hentning, og et billede engang imellem i løbet af dagen.',
  },
];

export interface ValueTeaser {
  number: string;
  title: string;
  body: string;
}

/** The short version, shown on the front page. */
export const valueTeasers: ValueTeaser[] = [
  {
    number: '01',
    title: 'Tryghed først',
    body: 'Et barn, der føler sig set, tør give sig i kast med verden. Derfor bruger jeg den første tid på at blive rigtigt kendt med hinanden.',
  },
  {
    number: '02',
    title: 'Tid til det hele',
    body: 'Vi skal ikke nå så meget. Der er tid til at tage sko på selv, til at kigge på en snegl og til at blive færdig med legen.',
  },
  {
    number: '03',
    title: 'Naturen som stue nummer to',
    body: 'Vi er ude i al slags vejr. Børn, der har rørt sig og fået frisk luft, sover bedre og skændes mindre.',
  },
  {
    number: '04',
    title: 'Tæt kontakt med jer',
    body: 'I får at vide, hvordan dagen gik - ikke som en rapport, men som en snak i døren. Og et billede engang imellem.',
  },
];
