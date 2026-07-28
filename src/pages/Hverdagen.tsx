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
      <section className="shell section--loose section--page-top hverdag__head">
        <h1 className="title-page">
          Dagens <em className="title-em">rytme</em>
        </h1>
      </section>

      {/* Pictures down the left, the day's hours down the right. On a phone the
          spread folds and the photographs come first. */}
      <section className="shell section--loose section--flush-top">
        <div className="hverdag__spread">
          {/* The column is cut from one block, like the Om-page mosaic: the
              rows are fr of its height, so every frame's shape comes from its
              cell (ratio="auto") and the block ends exactly where the hours do. */}
          <div className="hverdag__media">
            <ImageSlot photo={photos.hverdag1} ratio="auto" rounding="lg" />
            <div className="hverdag__pair">
              <ImageSlot photo={photos.hverdag2} ratio="auto" rounding="md" />
              <ImageSlot photo={photos.hverdag3} ratio="auto" rounding="md" />
            </div>
          </div>

          <ol className="timeline">
            {schedule.map((entry) => (
              <li key={entry.time} className="timeline__item">
                <div className="timeline__time">{entry.time}</div>
                <h2 className="timeline__title">{entry.title}</h2>
                <p className="timeline__body">{entry.description}</p>
              </li>
            ))}
          </ol>
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
