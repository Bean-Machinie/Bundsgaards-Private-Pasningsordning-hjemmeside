import { Link } from 'react-router-dom';

import ImageSlot from '../components/ImageSlot';
import { ClockIcon, HouseIcon, SproutIcon } from '../components/Icons';
import { photos } from '../content/photos';
import { headlineFacts, quickFacts } from '../content/practical';
import { fullAddress, site } from '../content/site';
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

const pillars = [
  {
    Icon: HouseIcon,
    tone: 'accent' as const,
    title: 'Den samme voksne',
    body: 'Dit barn bliver taget imod af mig hver morgen. Ingen vikarer, ingen skiftende stuer — bare en relation, der får lov at vokse i ro.',
  },
  {
    Icon: SproutIcon,
    tone: 'sage' as const,
    title: 'Ud i det fri hver dag',
    body: 'Have, mark og skovsti ligger lige uden for døren. Vi går ture, samler ting, mærker vejret og kommer hjem med beskidte knæ.',
  },
  {
    Icon: ClockIcon,
    tone: 'accent' as const,
    title: 'Rutiner der kan mærkes',
    body: 'Dagen ligner sig selv. Måltider, lur og leg falder på samme tid, så de mindste ved, hvad der kommer nu — og hvad der kommer bagefter.',
  },
];

export default function Forside() {
  useDocumentTitle();

  return (
    <div className="enter">
      {/* — hero ————————————————————————————————————————————————— */}
      <section className="shell section hero">
        <div>
          <span className="tag tag-accent-2 hero__tag">
            Privatpasning i {site.city} · {site.ageRange}
          </span>
          <h1 className="title-hero hero__title">Et lille sted at være lille</h1>
          <p className="lead measure hero__lead">
            Jeg passer fire børn i mit eget hjem på Bundsvej i {site.city}. Her er der tid
            til nærvær, leg og små oplevelser i hverdagen — og god plads til at komme
            udenfor hver dag.
          </p>
          <p className="muted hero__byline">
            {site.owner} · {fullAddress}
          </p>
          <div className="row">
            <Link to={routes.kontakt.path} className="btn btn-primary btn--lg">
              Book et besøg
            </Link>
            <Link to={routes.hverdagen.path} className="btn btn-secondary btn--lg">
              Se hverdagen
            </Link>
          </div>
          <p className="availability hero__availability">
            <span className="availability__dot" aria-hidden="true" />
            {site.availability} · {site.availabilityNote}
          </p>
        </div>

        <div className="hero__media">
          <ImageSlot photo={photos.hero} ratio="4 / 5" rounding="xl" eager className="elev-md" />
          <p className="hero__badge">
            <span className="hero__badge-number">{site.childCount}</span>
            <span>børn — og aldrig flere</span>
          </p>
        </div>
      </section>

      {/* — headline facts ————————————————————————————————————— */}
      <section className="shell section section--flush-top">
        <div className="factstrip">
          {headlineFacts.map((fact) => (
            <div key={fact.label} className="factstrip__cell">
              <div className="factstrip__value">{fact.value}</div>
              <div className="factstrip__label">{fact.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* — what a privatpasningsordning is ————————————————————— */}
      <section className="band band--surface">
        <div className="shell">
          <div className="measure--wide intro">
            <span className="kicker">Hvad er en privatpasningsordning</span>
            <h2 className="title-section">Et hjem frem for en institution</h2>
            <p className="prose prose--large intro__body">
              Jeg er godkendt af {site.municipality} til at passe børn i mit eget hjem.
              Kommunen giver tilskud til pladsen, og du vælger selv, hvem der passer dit
              barn. Det betyder færre børn, færre voksne at forholde sig til, og en
              hverdag der kan følge barnets tempo.
            </p>
          </div>

          <div className="grid" style={gridMin('240px')}>
            {pillars.map(({ Icon, tone, title, body }) => (
              <article key={title} className="card panel--bg pillar">
                <span className={`pillar__icon pillar__icon--${tone}`}>
                  <Icon />
                </span>
                <h3 className="card-title pillar__title">{title}</h3>
                <p className="card-body pillar__body">{body}</p>
              </article>
            ))}
          </div>
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
      <section className="band band--sage">
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

      {/* — closing call to action ——————————————————————————————— */}
      <section className="band band--accent">
        <div className="shell shell--narrow cta">
          <span className="tag tag-accent-2 cta__tag">{site.availability}</span>
          <h2 className="cta__title">Kom forbi og se stedet</h2>
          <p className="prose prose--large cta__body">
            Det bedste er at mødes. Kom en formiddag, hvor børnene er her, så I kan mærke
            stemningen — I er velkomne til at tage jeres barn med.
          </p>
          <div className="row cta__actions">
            <Link to={routes.kontakt.path} className="btn btn-primary btn--lg">
              Book et besøg
            </Link>
            <a href={`tel:${site.phoneHref}`} className="btn btn-secondary btn--lg">
              Ring {site.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
