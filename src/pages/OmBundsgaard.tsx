import Backdrop from '../components/Backdrop';
import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { site } from '../content/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { routes } from '../routes';

import './OmBundsgaard.css';

export default function OmBundsgaard() {
  useDocumentTitle(routes.om.title);

  return (
    <div className="enter">
      {/* One spread: the title, lead and both prose blocks run down the left,
          while the photo mosaic fills the right — its top level with the title
          and its bottom level with the last paragraph. On a phone the spread
          folds to one column and the mosaic is ordered up to sit just after the
          opening paragraph, ahead of the two texts. */}
      <section className="shell section section--page-top om__spread">
        <Backdrop variant="welcome" />

        <div className="om__intro">
          <h1 className="title-page">
            Om <em className="title-em">{site.name}</em>
          </h1>
          <p className="lead lead--page">
            {site.name} er en gammel gård med stråtag, høje træer og en stor have, hvor
            der er plads til at gå på opdagelse. Her bor jeg, og her passer jeg børn.
          </p>
        </div>

        <div className="om__text">
          <div>
            <h2 className="title-sub">Hverdagen</h2>
            <p className="prose">
              Det meste af dagen er vi udenfor. Vi fodrer hønsene og samler æg i
              hønsegården, graver i sandkassen og finder smådyr under stenene. Der er
              buske at gemme sig bag, græs at trille på og altid et hjørne, hvor man må
              grave.
            </p>
            <p className="prose">
              Indenfor har børnene deres eget rum ud til haven, hvor legetøjet står i lav
              højde, så de selv kan nå det. Vi spiser sammen ved det store bord, og
              middagsluren foregår i barnevogn under træerne, også om vinteren, godt
              pakket ind.
            </p>
          </div>
          <div>
            <h2 className="title-sub">Omgivelserne</h2>
            <p className="prose">
              Lige omkring gården er der marker, stier og natur til alle sider. Skoven
              ligger tæt på, og på vores ture møder vi heste og får, kigger på
              traktorer i marken og samler kastanjer og blade med hjem.
            </p>
          </div>
        </div>

        {/* Three tiles cut from one block — see OmBundsgaard.css. Each frame's
            shape comes from its cell, so the photos hand their ratio to the grid
            (ratio="auto") and cover whatever they are given. */}
        <div className="om__media">
          <div className="om__mosaic">
            <ImageSlot
              className="om__tile om__tile--square"
              photo={photos.omSquare}
              ratio="auto"
              eager
            />
            <ImageSlot
              className="om__tile om__tile--tall"
              photo={photos.omTall}
              ratio="auto"
              eager
            />
            <ImageSlot
              className="om__tile om__tile--wide"
              photo={photos.omWide}
              ratio="auto"
              eager
            />
          </div>
        </div>
      </section>
    </div>
  );
}
