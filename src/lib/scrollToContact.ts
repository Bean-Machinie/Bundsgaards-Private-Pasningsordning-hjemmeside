/**
 * Scrolls to the site footer, which holds the contact details (owner, phone,
 * mail, map). There is no separate contact page — the footer is the contact
 * section on every page, so the "Kontakt" links across the site all land here.
 */
export function scrollToContact(event?: { preventDefault(): void }) {
  event?.preventDefault();
  document
    .getElementById('kontakt')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
