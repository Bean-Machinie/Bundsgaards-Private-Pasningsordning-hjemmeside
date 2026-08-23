import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Backdrop from '../components/Backdrop';
import HeroCarousel from '../components/HeroCarousel';
import ImageSlot from '../components/ImageSlot';
import SealStamp from '../components/SealStamp';
import { photos } from '../content/photos';
import { headlineFacts } from '../content/practical';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSiteData } from '../lib/sheet/provider';
import { routes } from '../routes';

import './Forside.css';

/** The four moments from the day teased above the fold on the front page. */
const dayTeasers = [
  { photo: photos.day1, title: 'Ankomst' },
  { photo: photos.day2, title: 'Ude og lege i naturen' },
  { photo: photos.day3, title: 'Frokost ved det samme bord' },
  { photo: photos.day4, title: 'Middagslur' },
];

export default function Forside() {
  useDocumentTitle();
  const { openingHours, stamp } = useSiteData();

  return (
    <div className="enter">
      {/* — hero carousel ——————————————————————————————————————— */}
      <HeroCarousel />

      {/* The wax seal straddles the hero/welcome boundary — when there is one
          to press. Clearing the month in the sheet takes it off the page
          altogether rather than leaving an empty seal: an availability notice
          with no date on it says less than no notice at all. It costs the
          layout nothing either way, since the seal is a zero-height anchor
          hanging between two sections. */}
      {stamp && <SealStamp lines={stamp.lines} subline={stamp.sublines} />}

      {/* — welcome intro ——————————————————————————————————————— */}
      <section className="shell section welcome">
        <Backdrop variant="welcome" />
        <h2 className="welcome__script">Privat Pasningsordning tæt på Ganløse</h2>
        <p className="welcome__body">
          Bundsgård er en hyggelig gård med stråtag, stor have og egne høns. Vi er
          ude hver dag og går eller cykler ofte ture ned til hestene og fårene i området.
        </p>

        <div className="welcome__facts">
          {headlineFacts(openingHours).map((fact, index) => (
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
            <h2 className="title-section dayband__title">Sådan kan en dag se ud</h2>
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
              <div key={entry.title} className={index % 2 === 1 ? 'daycard daycard--offset' : 'daycard'}>
                <ImageSlot photo={entry.photo} ratio="1 / 1" className="daycard__circle" />
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

      {/* — values call to action ——————————————————————————————— */}
      <section className="shell section--loose values-section">
        <Backdrop variant="values" />
        <div className="values-intro">
          <h2 className="title-section">Det vigtigste sker i hverdagen</h2>
          <p className="values-body">
            I de små rutiner, i legen, på turen og i relationen til hinanden. Det er her
            tryghed, læring og udvikling får lov at vokse frem.
          </p>
          <Link to={routes.vaerdier.path} className="btn values-btn">
            Læs mere om vores værdier
          </Link>
        </div>
      </section>
    </div>
  );
}
