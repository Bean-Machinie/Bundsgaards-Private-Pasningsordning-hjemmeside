import ImageSlot from '../components/ImageSlot';
import { gallery } from '../content/photos';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { routes } from '../routes';

import './Galleri.css';

export default function Galleri() {
  useDocumentTitle(routes.galleri.title);

  // The layout is deliberately uneven: one wide opener, a three-up middle row
  // with a staggered centre, and a narrower closer.
  const [opener, ...rest] = gallery;
  const middle = rest.slice(0, 3);
  const closer = rest[3];

  return (
    <div className="enter">
      <section className="shell section--loose section--flush-bottom">
        <h1 className="title-page">
          Billeder fra <em className="title-em">en uge</em>
        </h1>
        <p className="lead lead--page">
          Ingen opstillede billeder. Det her er, hvordan der ser ud, når vi er midt i det.
        </p>
      </section>

      <section className="shell section--loose galleri">
        {opener && (
          <figure>
            <ImageSlot photo={opener} ratio={opener.ratio} rounding="lg" eager />
            <figcaption className="galleri__caption">{opener.caption}</figcaption>
          </figure>
        )}

        <div className="galleri__row">
          {middle.map((item, index) => (
            <figure
              key={item.placeholder}
              className={index === 1 ? 'galleri__item galleri__item--offset' : 'galleri__item'}
            >
              <ImageSlot photo={item} ratio={item.ratio} rounding="md" />
              <figcaption className="galleri__caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>

        {closer && (
          <figure className="galleri__closer">
            <ImageSlot photo={closer} ratio={closer.ratio} rounding="lg" />
            <figcaption className="galleri__caption">{closer.caption}</figcaption>
          </figure>
        )}
      </section>
    </div>
  );
}
