import Backdrop from '../components/Backdrop';
import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { highlights, schedule } from '../content/schedule';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { routes } from '../routes';

import './Hverdagen.css';

export default function Hverdagen() {
  useDocumentTitle(routes.hverdagen.title);

  return (
    <div className="enter">
      {/* Title and spread share one section, and that is load-bearing: the
          printed backdrop hangs on it (see .backdrop-host in Backdrop.css), and
          the picture stands taller than its host. Split in two, the top edge
          surfaced in the cream between the title and the photographs. Pictures
          down the left, the day's hours down the right — on a phone the spread
          folds and the photographs come first. */}
      <section className="shell section--loose section--page-top backdrop-host">
        <Backdrop variant="welcome" />

        <h1 className="title-page hverdag__title">
          Dagens <em className="title-em">rytme</em>
        </h1>
        <p className="lead lead--page hverdag__lead">
          Sådan plejer en helt almindelig dag at se ud hos os.
        </p>

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
              <li key={entry.title} className="timeline__item">
                {/* Title and hour on one line, in the front page's handwritten
                    voice — the welcome section's script line verbatim. */}
                <h2 className="timeline__title">
                  {entry.title}
                  {entry.time ? ` - ${entry.time}` : ''}
                </h2>
                <p className="timeline__body">{entry.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The recurring things, in the values page's grammar: handwritten
          terracotta titles above their own text, no cards and no weekdays. */}
      <section className="band band--surface hverdag__extras-section">
        <div className="shell">
          <h2 className="title-section hverdag__extras-title">Det der går igen</h2>
          <div className="hverdag__extras">
            {highlights.map((item) => (
              <article key={item.title}>
                <h3 className="hverdag__extra-title">{item.title}</h3>
                <p className="hverdag__extra-body">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
