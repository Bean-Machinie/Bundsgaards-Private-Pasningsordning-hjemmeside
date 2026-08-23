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
            Jeg hedder Dorte, og børn har altid fyldt meget i mit liv. Allerede som
            11-årig begyndte jeg at passe børn, og siden har jeg fået erfaring med børn
            både som mor til tre døtre, som mormor og gennem mit arbejdsliv som lærer og
            viceskoleleder.
          </p>
          <p className="prose prose--large ommig__para">
            Jeg har altid haft et stort hjerte for børn og været optaget af deres
            udvikling og muligheder for at udfolde sig. Derfor har jeg valgt at blive
            privat børnepasser, hvor jeg kan bruge min tid på nærvær og samvær med
            børnene.
          </p>
          <p className="prose prose--large ommig__para">
            Naturen, dyr og det at bruge hænderne betyder meget for mig, og den glæde vil
            jeg gerne give videre til børnene. Jeg tror på, at børn lærer og udvikler sig
            gennem hele kroppen. For både store og små afhænger læring af at bruge hjerne
            og hænder samt at have hjertet med.
          </p>
        </div>
      </section>
    </div>
  );
}
