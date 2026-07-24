import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { schedule, weeklyHighlights } from '../content/schedule';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { routes } from '../routes';

import './Hverdagen.css';

export default function Hverdagen() {
  useDocumentTitle(routes.hverdagen.title);

  return (
    <div className="enter">
      <section className="shell section--loose section--flush-bottom">
        <span className="kicker">Hverdagen</span>
        <h1 className="title-page hverdag__title">Dagen har en rytme — ikke et skema</h1>
        <p className="lead lead--page">
          Tiderne herunder er dem, vi som regel følger. Er der et barn, der sover længe,
          eller en leg der er blevet god, så flytter vi os efter det.
        </p>
      </section>

      <section className="shell section--loose">
        <div className="grid grid--split-top" style={gridMin('300px')}>
          <ol className="timeline">
            {schedule.map((entry) => (
              <li key={entry.time} className="timeline__item">
                <div className="timeline__time">{entry.time}</div>
                <h2 className="timeline__title">{entry.title}</h2>
                <p className="timeline__body">{entry.description}</p>
              </li>
            ))}
          </ol>

          <div className="hverdag__media">
            <ImageSlot photo={photos.hverdag1} ratio="4 / 5" rounding="lg" />
            <div className="hverdag__pair">
              <ImageSlot photo={photos.hverdag2} ratio="1 / 1" rounding="md" />
              <ImageSlot photo={photos.hverdag3} ratio="1 / 1" rounding="md" />
            </div>
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <div className="shell">
          <h2 className="title-sub hverdag__week-title">Det der går igen om ugen</h2>
          <div className="grid" style={gridMin('220px')}>
            {weeklyHighlights.map((item) => (
              <article key={item.day} className="card panel--bg hverdag__card">
                <div className="card-kicker">{item.day}</div>
                <h3 className="card-title hverdag__card-title">{item.title}</h3>
                <p className="card-body hverdag__card-body">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
