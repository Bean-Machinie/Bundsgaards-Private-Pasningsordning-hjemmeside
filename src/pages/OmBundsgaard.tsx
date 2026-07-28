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
      <section className="shell section om__spread">
        <div className="om__intro">
          <h1 className="title-page">
            Om <em className="title-em">{site.name}</em>
          </h1>
          <p className="lead lead--page">
            {site.name} er ikke en institution, der ligner et hjem. Det er et hjem, hvor
            der også bliver passet børn — og det kan man mærke fra man træder ind i
            entréen.
          </p>
        </div>

        <div className="om__text">
          <div>
            <h2 className="title-sub">Rammerne</h2>
            <p className="prose">
              Børnene har deres eget rum ud til haven, hvor legetøjet står i lav højde, så
              de selv kan finde det frem. Vi spiser ved det samme bord som resten af
              familien, og der bliver sovet i barnevogn under træerne — også om vinteren.
            </p>
            <p className="prose">
              Haven er ikke en legeplads. Der er en græsplæne, et bed vi passer sammen, en
              sandkasse og et hjørne, hvor man må grave.
            </p>
          </div>
          <div>
            <h2 className="title-sub">Omgivelserne</h2>
            <p className="prose">
              Fra Bundsvej går vi ad markvejen og er ved skovkanten på et kvarter — også
              med de mindste i barnevogn. Vi kigger på traktorer, samler kastanjer og
              hilser på hestene på vejen hjem.
            </p>
            <p className="prose">
              En gang om ugen tager vi længere afsted, hvis vejret er til det: til
              stranden, til biblioteket eller til legepladsen i byen.
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
