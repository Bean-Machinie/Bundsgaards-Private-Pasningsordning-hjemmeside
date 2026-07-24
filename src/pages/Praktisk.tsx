import { useId, useState } from 'react';
import { Link } from 'react-router-dom';

import { faqs } from '../content/faqs';
import { practicalNotes, practicalPanels } from '../content/practical';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { routes } from '../routes';

import './Praktisk.css';

export default function Praktisk() {
  useDocumentTitle(routes.praktisk.title);

  // One answer open at a time, as in the prototype. -1 means all closed.
  const [openFaq, setOpenFaq] = useState(0);
  const faqId = useId();

  return (
    <div className="enter">
      <section className="shell section--loose section--flush-bottom">
        <span className="kicker">Praktisk information</span>
        <h1 className="title-page praktisk__title">Det I skal vide, før I siger ja</h1>
        <p className="lead lead--page">
          Er der noget, der ikke står her, så spørg endelig. Jeg svarer hellere en gang for
          meget.
        </p>
      </section>

      <section className="shell section">
        <div className="grid" style={gridMin('250px')}>
          {practicalPanels.map((panel) => (
            <div key={panel.title} className="panel">
              <h2 className="praktisk__panel-title">{panel.title}</h2>
              {panel.intro && <p className="praktisk__panel-intro">{panel.intro}</p>}
              {panel.rows.map((row) => (
                <div key={row.label} className="spec-row">
                  <span>{row.label}</span>
                  <span className={row.muted ? 'muted' : undefined}>{row.value}</span>
                </div>
              ))}
              {panel.footnote && <p className="praktisk__footnote">{panel.footnote}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="shell section section--flush-top">
        <div className="grid" style={gridMin('240px')}>
          {practicalNotes.map((note) => (
            <div key={note.title}>
              <h2 className="praktisk__note-title">{note.title}</h2>
              <p className="praktisk__note-body">{note.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band band--surface">
        <div className="shell shell--narrow">
          <h2 className="title-sub praktisk__faq-heading">Ofte stillede spørgsmål</h2>

          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const panelId = `${faqId}-panel-${index}`;
            const buttonId = `${faqId}-button-${index}`;

            return (
              <div key={faq.question} className="faq">
                <h3 className="faq__heading">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq__sign" aria-hidden="true">
                      {isOpen ? '–' : '+'}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                  <p className="faq__answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}

          <div className="faq__outro">
            <Link to={routes.kontakt.path} className="btn btn-primary">
              Spørg om noget andet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
