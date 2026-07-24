import ImageSlot from '../components/ImageSlot';
import { photos } from '../content/photos';
import { site } from '../content/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { routes } from '../routes';

import './OmBundsgaard.css';

const detailPhotos = [photos.om1, photos.om2, photos.om3, photos.om4];

export default function OmBundsgaard() {
  useDocumentTitle(routes.om.title);

  return (
    <div className="enter">
      <section className="shell section--loose section--flush-bottom">
        <span className="kicker">Om {site.name}</span>
        <h1 className="title-page om__title">Huset, haven og det der ligger udenfor</h1>
        <p className="lead lead--page">
          {site.name} er ikke en institution, der ligner et hjem. Det er et hjem, hvor der
          også bliver passet børn — og det kan man mærke fra man træder ind i entréen.
        </p>
      </section>

      <section className="shell section">
        <ImageSlot photo={photos.omHero} ratio="16 / 7" rounding="xl" eager />
      </section>

      <section className="shell section section--flush-top">
        <div className="grid" style={gridMin('280px')}>
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
      </section>

      <section className="band band--surface">
        <div className="shell grid" style={gridMin('220px')}>
          {detailPhotos.map((photo) => (
            <ImageSlot key={photo.placeholder} photo={photo} ratio="1 / 1" rounding="md" />
          ))}
        </div>
      </section>

      <section className="shell shell--narrow section--loose quote">
        <blockquote className="quote__text">
          „Vi kom for at se et sted. Vi gik hjem med en fornemmelse af, at der var nogen,
          der ville kende vores dreng.“
        </blockquote>
        <p className="quote__attribution">Mor til Alma, 1½ år</p>
      </section>
    </div>
  );
}
