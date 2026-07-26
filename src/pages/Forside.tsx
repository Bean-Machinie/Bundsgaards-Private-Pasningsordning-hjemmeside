import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import HeroCarousel from '../components/HeroCarousel';
import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { headlineFacts, quickFacts } from '../content/practical';
import { site } from '../content/site';
import { valueTeasers } from '../content/values';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { routes } from '../routes';

import './Forside.css';

/** The four moments from the day teased above the fold on the front page. */
const dayTeasers = [
  { photo: photos.day1, time: '07.30', title: 'Morgenmad sammen' },
  { photo: photos.day2, time: '09.00', title: 'Ud af huset' },
  { photo: photos.day3, time: '11.00', title: 'Frokost' },
  { photo: photos.day4, time: '11.45', title: 'Lur i haven' },
];

export default function Forside() {
  useDocumentTitle();

  return (
    <div className="enter">
      {/* — hero carousel ——————————————————————————————————————— */}
      <HeroCarousel />

      {/* — welcome intro ——————————————————————————————————————— */}
      <section className="shell section welcome">
        <h2 className="welcome__script">Privat Pasningsordning tæt på Ganløse</h2>
        <p className="welcome__body">
          Bundsgård er en hyggelig gård med stråtag, stor have og egne høns. Vi er
          ude hver dag og går ofte ture ned til hestene og fårene i området.
        </p>

        <div className="welcome__facts">
          {headlineFacts.map((fact, index) => (
            <Fragment key={fact.label}>
              {index > 0 && <span className="welcome__dot" aria-hidden="true" />}
              <div className="welcome__fact">
                <div className="welcome__fact-value">{fact.value}</div>
                <div className="welcome__fact-label">{fact.label}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* — values teaser ——————————————————————————————————————— */}
      <section className="shell section--loose">
        <div className="grid grid--split-top">
          <div className="stack">
            <div>
              <span className="kicker">Værdier</span>
              <h2 className="title-section">Det jeg lægger vægt på</h2>
              <p className="prose measure--tight">
                Jeg lægger vægt på trygge relationer, genkendelige rutiner og plads til det
                enkelte barn. Det lyder enkelt — og det er det også. Men det kræver, at der
                ikke er for mange om buddet.
              </p>
            </div>
            <Link to={routes.vaerdier.path} className="btn btn-ghost link-more">
              Læs om pædagogikken →
            </Link>
          </div>

          <div className="fact-list">
            {valueTeasers.map((value) => (
              <div key={value.number} className="fact">
                <span className="fact__n">{value.number}</span>
                <div>
                  <h3 className="fact__title">{value.title}</h3>
                  <p className="fact__body">{value.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — a day in pictures ——————————————————————————————————— */}
      <section className="band band--primary">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="kicker">Hverdagen</span>
              <h2 className="title-section section-head__title">En helt almindelig tirsdag</h2>
            </div>
            <Link to={routes.hverdagen.path} className="btn btn--on-dark">
              Se hele dagen
            </Link>
          </div>

          <div className="grid" style={gridMin('200px')}>
            {dayTeasers.map((entry, index) => (
              <div key={entry.time} className={index % 2 === 1 ? 'daycard daycard--offset' : 'daycard'}>
                <ImageSlot photo={entry.photo} ratio="3 / 4" rounding="md" />
                <div className="daycard__time">{entry.time}</div>
                <div className="daycard__title">{entry.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — about Dorte ————————————————————————————————————————— */}
      <section className="shell section--loose">
        <div className="grid grid--split">
          <ImageSlot photo={photos.dorte} ratio="1 / 1" rounding="xl" className="elev-sm" />
          <div className="stack">
            <div>
              <span className="kicker">Om mig</span>
              <h2 className="title-section">Jeg hedder Dorte</h2>
              <p className="prose prose--large measure">
                Jeg har arbejdet med små børn i mange år, og jeg valgte at åbne{' '}
                {site.name}, fordi jeg savnede tiden med det enkelte barn. Her kan jeg nå
                at sidde ned med den, der har brug for det, og stadig få hverdagen til at
                hænge sammen.
              </p>
              <p className="prose prose--large measure">
                Jeg bor på Bundsvej sammen med min mand. Vi har have, høns og god plads til
                gummistøvler i entréen.
              </p>
            </div>
            <Link to={routes.ommig.path} className="btn btn-ghost link-more">
              Mere om mig →
            </Link>
          </div>
        </div>
      </section>

      {/* — practical, short version ————————————————————————————— */}
      <section className="shell section section--flush-top">
        <div className="panel panel--roomy">
          <div className="section-head section-head--baseline">
            <h2 className="title-sub section-head__title">Det praktiske, kort fortalt</h2>
            <Link to={routes.praktisk.path} className="btn btn-ghost">
              Al praktisk information →
            </Link>
          </div>
          <div className="deflist">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <div className="deflist__label">{fact.label}</div>
                <div className="deflist__value">{fact.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
