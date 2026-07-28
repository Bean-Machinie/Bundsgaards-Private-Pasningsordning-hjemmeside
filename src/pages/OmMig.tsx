import Backdrop from '../components/Backdrop';
import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { site } from '../content/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { routes } from '../routes';

import './OmMig.css';

export default function OmMig() {
  useDocumentTitle(routes.ommig.title);

  return (
    <div className="enter">
      <section
        className="shell section--loose section--page-top grid grid--split-top ommig"
        style={gridMin('290px')}
      >
        <Backdrop variant="welcome" />

        <div>
          <ImageSlot photo={photos.dorteFull} ratio="1 / 1" rounding="xl" eager />
        </div>

        <div>
          <h1 className="ommig__title">
            Om <em className="title-em">mig</em>
          </h1>
          {/* The opening line is the only thing here that is known. Everything
              below it is a note to Dorte about what to write — plain text, no
              invented copy. Delete the whole .ommig__brief block once the real
              paragraphs are in. */}
          <p className="prose prose--large ommig__para">Jeg hedder {site.owner} …</p>

          <div className="ommig__brief">
            <p className="ommig__brief-note">
              Her skriver du selv din tekst — lidt om hvem du er, og hvordan du er sammen
              med børnene.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
