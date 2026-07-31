import { hoursOf, openingHours } from './site';

export interface SpecRow {
  label: string;
  value: string;
  /** Renders the value in muted ink — for "Lukket", "Oplyses ved kontakt" etc. */
  muted?: boolean;
}

export interface SpecPanel {
  title: string;
  intro?: string;
  rows: SpecRow[];
  footnote?: string;
}

export const practicalPanels: SpecPanel[] = [
  {
    title: 'Åbningstider',
    rows: [
      // One row per opening row, straight from site.ts — this panel is the
      // fullest listing on the site, so it must not carry its own copy of the
      // times.
      ...openingHours.map((row) => ({ label: row.days, value: hoursOf(row) })),
      { label: 'Weekend', value: 'Lukket', muted: true },
    ],
    footnote:
      'Har I brug for at aflevere tidligere en enkelt dag, finder vi ud af det.',
  },
  {
    title: 'Ferie og lukkedage',
    rows: [
      { label: 'Uge 29 og 30', value: 'Sommerferie' },
      { label: 'Uge 42', value: 'Efterårsferie' },
      { label: '23. dec - 1. jan', value: 'Jul og nytår' },
      { label: '5 dage', value: 'Efter aftale' },
    ],
    // TODO: erstat med de faktiske datoer for året.
    footnote: 'Datoerne meldes ud i god tid ved årets start. (Placeholder — rettes til.)',
  },
  {
    title: 'Pris og tilskud',
    intro:
      'Egedal Kommune giver tilskud til en privat pasningsordning. Tilskuddet søges hos kommunen, og I betaler forskellen direkte til mig.',
    rows: [
      { label: 'Fuldtidsplads, 0-3 år', value: 'Oplyses ved kontakt', muted: true },
      { label: 'Mad og bleer', value: 'Inkluderet' },
    ],
  },
];

export interface PracticalNote {
  title: string;
  body: string;
}

export const practicalNotes: PracticalNote[] = [
  {
    title: 'Indkøring',
    body: 'Vi bruger som regel en uge. Første dag er kort og med jer, og så udvider vi stille og roligt. I bestemmer tempoet sammen med mig.',
  },
  {
    title: 'Mad',
    body: 'Jeg laver morgenmad, frokost og eftermiddagsmad. Almindelig hjemmelavet mad, meget grønt, og vi tager hensyn til allergier.',
  },
  {
    title: 'Sygdom',
    body: 'Et sygt barn skal være hjemme — både for sin egen skyld og for de andres. Bliver jeg selv syg, har jeg en fast aftale om afløsning, som I møder på forhånd.',
  },
  {
    title: 'Opsigelse',
    body: 'To måneder til den 1. Vi skriver en almindelig pasningsaftale, som kommunen skal godkende.',
  },
];

export interface Fact {
  value: string;
  label: string;
}

/** The dot-separated strip of headline facts under the front-page welcome.
 *  Each cell is one big value over one small label, so the hours can't be two
 *  rows here — the value quotes the week's span and the label carries Friday's
 *  earlier close, rather than the strip claiming a single time for all five
 *  days. */
export const headlineFacts: Fact[] = [
  { value: '4 børn', label: 'fast lille gruppe' },
  { value: '0-3 år', label: 'til start i børnehave' },
  {
    value: hoursOf(openingHours[0]),
    label: `mandag til torsdag, fredag til ${openingHours[1].closes}`,
  },
  { value: 'Udenfor', label: 'hver dag, året rundt' },
];

