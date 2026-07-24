import { useId, useState } from 'react';

import { CheckIcon } from '../components/Icons';
import { site } from '../content/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { sendEnquiry, type Enquiry } from '../lib/enquiry';
import { routes } from '../routes';

import './Kontakt.css';

const visitSlots = [
  'Formiddag (9–11)',
  'Eftermiddag (14–15.30)',
  'Efter kl. 16',
  'Weekend',
] as const;

const emptyEnquiry: Enquiry = {
  name: '',
  contact: '',
  childAge: '',
  preferredStart: '',
  visitSlot: visitSlots[0],
  message: '',
};

type Status = 'idle' | 'sending' | 'sent' | 'error';
type FieldErrors = Partial<Record<'name' | 'contact', string>>;

export default function Kontakt() {
  useDocumentTitle(routes.kontakt.title);

  const [form, setForm] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const id = useId();

  const update = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === 'name' || key === 'contact') {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Skriv dit navn, så jeg ved hvem I er.';
    if (!form.contact.trim()) {
      nextErrors.contact = 'Skriv et telefonnummer eller en mail, så jeg kan svare.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');
    try {
      await sendEnquiry(form);
      setStatus('sent');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="enter">
      <section className="shell section--loose grid grid--split-top">
        {/* — the details, left column ————————————————————————— */}
        <div>
          <span className="kicker">Kontakt</span>
          <h1 className="kontakt__title">Kom og se stedet</h1>
          <p className="prose prose--large kontakt__lead">
            Skriv et par ord om jeres barn og hvornår I har brug for en plads. Så finder vi
            et tidspunkt, hvor I kan komme forbi — helst mens børnene er her.
          </p>

          <dl className="kontakt__details">
            <div className="kontakt__detail">
              <dt className="kontakt__detail-label">Adresse</dt>
              <dd className="kontakt__detail-value">
                {site.street}
                <br />
                {site.postalCode} {site.city}
              </dd>
            </div>
            <div className="kontakt__detail">
              <dt className="kontakt__detail-label">Telefon</dt>
              <dd className="kontakt__detail-value">
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              </dd>
            </div>
            <div className="kontakt__detail">
              <dt className="kontakt__detail-label">Mail</dt>
              <dd className="kontakt__detail-value">
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div className="kontakt__detail">
              <dt className="kontakt__detail-label">Bedst</dt>
              <dd className="kontakt__detail-value muted">{site.bestReachedAt}</dd>
            </div>
          </dl>

          <div className="kontakt__map">
            {/* Decorative stand-in for a map — no tracking, no API key. */}
            <div className="kontakt__map-canvas">
              <svg
                viewBox="0 0 400 210"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Decorative — colours pulled from the theme palette. */}
                <rect width="400" height="210" fill="var(--color-secondary)" />
                <path
                  d="M-10 150 C 90 130, 150 170, 260 120 S 380 60, 420 70"
                  stroke="color-mix(in srgb, var(--color-primary) 22%, transparent)"
                  strokeWidth="26"
                  fill="none"
                />
                <path
                  d="M60 -10 C 80 60, 40 120, 90 220"
                  stroke="var(--color-bg)"
                  strokeWidth="14"
                  fill="none"
                />
                <path
                  d="M-10 96 C 120 80, 260 108, 420 84"
                  stroke="var(--color-bg)"
                  strokeWidth="18"
                  fill="none"
                />
                <circle
                  cx="196"
                  cy="92"
                  r="30"
                  fill="color-mix(in srgb, var(--color-primary) 30%, transparent)"
                />
                <circle cx="196" cy="92" r="9" fill="var(--color-accent)" />
              </svg>
              <p className="kontakt__map-pin">
                {site.street} · 5 min. fra {site.city} st.
              </p>
            </div>
            <div className="kontakt__map-footer">
              <span className="kontakt__map-note">Der er plads til at holde på indkørslen.</span>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary kontakt__map-link"
              >
                Åbn i kort
              </a>
            </div>
          </div>
        </div>

        {/* — the form, right column ——————————————————————————— */}
        <div className="panel panel--roomy">
          {status === 'sent' ? (
            <div className="kontakt__receipt">
              <span className="kontakt__receipt-icon">
                <CheckIcon size={26} />
              </span>
              <h2 className="kontakt__receipt-title">Tak — jeg vender tilbage</h2>
              <p className="kontakt__receipt-body">
                Jeg svarer som regel samme dag, senest dagen efter. Haster det, må I meget
                gerne ringe.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="kontakt__form-title">Skriv til mig</h2>
              <p className="kontakt__form-note">
                Alle felter er frivillige undtagen navn og kontakt.
              </p>

              <div className="kontakt__fields">
                <div className="field">
                  <label htmlFor={`${id}-navn`}>Dit navn</label>
                  <input
                    className="input"
                    id={`${id}-navn`}
                    name="name"
                    autoComplete="name"
                    placeholder="Fx Ida Nielsen"
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${id}-navn-fejl` : undefined}
                  />
                  {errors.name && (
                    <p className="field__error" id={`${id}-navn-fejl`}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor={`${id}-kontakt`}>Telefon eller mail</label>
                  <input
                    className="input"
                    id={`${id}-kontakt`}
                    name="contact"
                    placeholder="Så jeg kan svare"
                    value={form.contact}
                    onChange={(event) => update('contact', event.target.value)}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? `${id}-kontakt-fejl` : undefined}
                  />
                  {errors.contact && (
                    <p className="field__error" id={`${id}-kontakt-fejl`}>
                      {errors.contact}
                    </p>
                  )}
                </div>
              </div>

              <div className="kontakt__fields">
                <div className="field">
                  <label htmlFor={`${id}-alder`}>Barnets alder</label>
                  <input
                    className="input"
                    id={`${id}-alder`}
                    name="childAge"
                    placeholder="Fx 9 måneder"
                    value={form.childAge}
                    onChange={(event) => update('childAge', event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`${id}-start`}>Ønsket opstart</label>
                  <input
                    className="input"
                    id={`${id}-start`}
                    name="preferredStart"
                    type="month"
                    value={form.preferredStart}
                    onChange={(event) => update('preferredStart', event.target.value)}
                  />
                </div>
              </div>

              <fieldset className="kontakt__slots">
                <legend className="kontakt__slots-legend">
                  Hvornår passer et besøg bedst?
                </legend>
                <div className="row">
                  {visitSlots.map((slot) => (
                    <label
                      key={slot}
                      className={
                        form.visitSlot === slot ? 'chip chip--selected' : 'chip'
                      }
                    >
                      <input
                        type="radio"
                        name="visitSlot"
                        value={slot}
                        checked={form.visitSlot === slot}
                        onChange={() => update('visitSlot', slot)}
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="field kontakt__message">
                <label htmlFor={`${id}-besked`}>Et par ord om jer</label>
                <textarea
                  className="input kontakt__textarea"
                  id={`${id}-besked`}
                  name="message"
                  placeholder="Fx: Vi bor i Stenløse og skal bruge en plads fra august. Vores søn er 10 måneder."
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                />
              </div>

              {status === 'error' && (
                <p className="kontakt__error" role="alert">
                  Beskeden kunne ikke sendes. Prøv igen, eller ring til mig på{' '}
                  <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block kontakt__submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sender …' : 'Send og aftal et besøg'}
              </button>

              <p className="kontakt__privacy">
                Jeg bruger kun jeres oplysninger til at svare jer.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
