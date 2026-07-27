import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { credentials } from '../content/practical';
import { site } from '../content/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { routes } from '../routes';

import './OmMig.css';

export default function OmMig() {
  useDocumentTitle(routes.ommig.title);

  return (
    <div className="enter">
      <section className="shell section--loose grid grid--split-top" style={gridMin('290px')}>
        <div className="ommig__portrait">
          <ImageSlot photo={photos.dorteFull} ratio="4 / 5" rounding="xl" eager />
        </div>

        <div>
          <h1 className="ommig__title">
            Om <em className="title-em">mig</em>
          </h1>
          <p className="prose prose--large ommig__para">
            Jeg hedder {site.owner}. Jeg er uddannet pædagog og har arbejdet med de yngste
            børn i mange år, både i vuggestue og i dagpleje. For nogle år siden valgte jeg
            at gøre det på min egen måde, hjemme på Bundsvej.
          </p>
          <p className="prose prose--large ommig__para">
            Jeg er rolig af natur, jeg taler med børn som med mennesker, og jeg synes, at
            en dag er lykkedes, når alle fire har været trætte og glade på samme tid.
          </p>
          <p className="prose prose--large ommig__para">
            Privat bor jeg her med min mand. Vi har voksne børn, en gammel hund og en have,
            der aldrig bliver helt færdig.
          </p>

          <ul className="ommig__credentials">
            {credentials.map((item) => (
              <li key={item.value} className="ommig__credential">
                <div className="ommig__credential-title">{item.value}</div>
                <div className="ommig__credential-note">{item.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
