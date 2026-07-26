import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import HeroCarousel from '../components/HeroCarousel';
import ImageSlot from '../components/ImageSlot';
import SealStamp from '../components/SealStamp';
import { photos } from '../content/photos';
import { headlineFacts, quickFacts } from '../content/practical';
import { valueTeasers } from '../content/values';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { routes } from '../routes';

import './Forside.css';

/** The four moments from the day teased above the fold on the front page. */
const dayTeasers = [
  { photo: photos.day1, time: '07.30', title: 'Ankomst' },
  { photo: photos.day2, time: '09.00', title: 'Ude og lege i naturen' },
  { photo: photos.day3, time: '11.00', title: 'Frokost ved det samme bord' },
  { photo: photos.day4, time: '11.45', title: 'Middagslur' },
];

export default function Forside() {
  useDocumentTitle();

  return (
    <div className="enter">
      {/* — hero carousel ——————————————————————————————————————— */}
      <HeroCarousel />

      {/* The wax seal straddles the hero/welcome boundary. */}
      <SealStamp lines={['Ledige', 'pladser']} subline="August 2027" />

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

      {/* — a day in pictures ——————————————————————————————————— */}
      <section className="band band--primary dayband">
        <div className="shell">
          <div className="dayband__head">
            <p className="dayband__script">En helt almindelig tirsdag</p>
            <h2 className="title-section dayband__title">Sådan ser dagen ud</h2>
          </div>

          <div className="dayband__row">
            {/* The dotted thread: one long sine meander through all four
                medallions — each circle centre sits on a zero-crossing, so the
                line flows diagonally through the photos and arcs gracefully
                above, below, above in the three gaps. A half-wave is added
                before the first circle and after the last (the viewBox clips
                them mid-arc), and the gradient stroke fades those run-outs to
                nothing so the thread reads as passing through, not ending. */}
            <svg
              className="dayband__thread"
              viewBox="0 0 1000 244"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="dayband-thread-fade"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="1000"
                  y2="0"
                >
                  {/* The run-outs live in the outer 12.5%; fading across all
                      of that would hide them entirely, so only the outer
                      stretch dissolves and the rest stays visible. */}
                  <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="0.09" stopColor="currentColor" stopOpacity="1" />
                  <stop offset="0.91" stopColor="currentColor" stopOpacity="1" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M -125 122 C -35 202 35 202 125 122 C 215 42 285 42 375 122 C 465 202 535 202 625 122 C 715 42 785 42 875 122 C 965 202 1035 202 1125 122"
                fill="none"
                stroke="url(#dayband-thread-fade)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.1 11"
              />
            </svg>
            {dayTeasers.map((entry, index) => (
              <div key={entry.time} className={index % 2 === 1 ? 'daycard daycard--offset' : 'daycard'}>
                <ImageSlot photo={entry.photo} ratio="1 / 1" className="daycard__circle" />
                <div className="daycard__time">{entry.time}</div>
                <div className="daycard__title">{entry.title}</div>
              </div>
            ))}
          </div>

          <div className="dayband__cta">
            <Link to={routes.hverdagen.path} className="btn dayband__btn">
              Se hele dagen
            </Link>
          </div>
        </div>
      </section>

      {/* — values teaser ——————————————————————————————————————— */}
      <section className="shell section--loose">
        <div className="values-split">
          <div className="stack">
            <div>
              <h2 className="title-section">Vores Værdier</h2>
              <p className="values-body measure--tight">
                Jeg lægger vægt på trygge relationer, genkendelige rutiner og plads til det
                enkelte barn. Det lyder enkelt og det er det også. Men det kræver, at der
                ikke er for mange om buddet.
              </p>
            </div>
            <Link to={routes.vaerdier.path} className="btn values-btn link-more">
              Læs mere
            </Link>
          </div>

          <div className="values-grid">
            {valueTeasers.map((value) => (
              <div key={value.number} className="fact">
                <div>
                  <h3 className="fact__title">{value.title}</h3>
                  <p className="fact__body">{value.body}</p>
                </div>
              </div>
            ))}
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
