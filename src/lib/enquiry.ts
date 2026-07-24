/**
 * Delivery of the contact form.
 *
 * There is no backend yet. Set `VITE_CONTACT_ENDPOINT` to a URL that accepts a
 * JSON POST (a form service such as Formspree, or your own function) and the
 * form starts delivering for real. Without it the enquiry is logged to the
 * console and reported as sent, so the flow is testable in development —
 * that means nothing is delivered until the variable is set.
 */

export interface Enquiry {
  name: string;
  contact: string;
  childAge: string;
  preferredStart: string;
  visitSlot: string;
  message: string;
}

export async function sendEnquiry(enquiry: Enquiry): Promise<void> {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

  if (!endpoint) {
    console.warn(
      'VITE_CONTACT_ENDPOINT is not set — henvendelsen blev ikke sendt nogen steder hen.',
      enquiry,
    );
    return;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(enquiry),
  });

  if (!response.ok) {
    throw new Error(`Kontaktformularen svarede med ${response.status}`);
  }
}
