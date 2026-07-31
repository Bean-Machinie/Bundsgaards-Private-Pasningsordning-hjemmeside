export interface Faq {
  question: string;
  answer: string;
}

/** The FAQ band reads as a section of its own, so its closing line — the one
 *  pointing at the contact details — lives here with the questions rather than
 *  inside the page component. The heading is in the page, like every other
 *  title on the site: the accented word is markup, not a string. */
export const faqFoot = {
  prompt: 'Fandt I ikke svaret her?',
  link: 'Skriv til mig',
};

/** The FAQ band's anchor. The footer links straight to it, so the id and the
 *  href have to agree — hence one constant rather than two literals. */
export const FAQ_ANCHOR = 'faq';

export const faqs: Faq[] = [
  {
    question: 'Hvordan søger vi tilskud?',
    answer:
      'I søger tilskuddet hos Egedal Kommune, når vi har skrevet en pasningsaftale. Jeg hjælper gerne med papirerne — det er ikke så indviklet, som det lyder.',
  },
  {
    question: 'Hvad sker der, hvis du bliver syg?',
    answer:
      'Jeg har en fast aftale med en afløser, som børnene kender i forvejen. Ved længere sygdom kontakter jeg jer med det samme, så I kan nå at planlægge.',
  },
  {
    question: 'Kan vi komme forbi, før vi beslutter os?',
    answer:
      'Ja, og det vil jeg helst. Kom en formiddag, hvor børnene er her, gerne med jeres eget barn. Så kan I mærke stemningen i stedet for at læse om den.',
  },
  {
    question: 'Hvad skal vi selv have med?',
    answer:
      'Skiftetøj, overtøj efter årstiden og en sut eller en bamse, hvis der er en. Mad og bleer er med i prisen.',
  },
  {
    question: 'Hvad når barnet skal i børnehave?',
    answer:
      'Vi taler om det i god tid, og jeg skriver gerne et par ord om, hvor barnet er nået til. Vi besøger børnehaven sammen, hvis det kan lade sig gøre.',
  },
];
