/**
 * Ofte stillede spørgsmål.
 *
 * The questions themselves come from the "# SPØRGSMÅL OG SVAR" block of the
 * Google Sheet (see src/lib/sheet) — a new row there is a new accordion row
 * here, no deploy involved. Read them with `useSiteData().faqs`.
 */

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
