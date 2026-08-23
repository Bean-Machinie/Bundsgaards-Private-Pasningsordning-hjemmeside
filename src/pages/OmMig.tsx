import Backdrop from '../components/Backdrop';
import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
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
          <p className="prose prose--large ommig__para">
            Jeg er en voksen og moden kvinde. Jeg har altid haft med børn at gøre lige
            fra min karriere som barnepige som startede da jeg kun var 11 år, som mor til
            3 døtre, mormor og professionelt som lærer og viceskoleleder. Jeg har altid
            haft et blødt hjerte for børn og har været optaget af børns progression og
            deres muligheder for at udvikle sig. Jeg har derfor valgt at skifte til
            privat passer for at bruge min primære tid sammen med børn
          </p>
          <p className="prose prose--large ommig__para">
            Dyr, at være i naturen og bruge mine hænder betyder meget for mig og den
            glæde vil jeg gerne give videre. Store som små er vores læring afhængig af
            hjerne og hænder, samt at have hjertet med.
          </p>
        </div>
      </section>
    </div>
  );
}
