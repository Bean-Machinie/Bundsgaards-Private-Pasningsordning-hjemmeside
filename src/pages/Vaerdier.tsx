import { values } from '../content/values';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { routes } from '../routes';

import './Vaerdier.css';

export default function Vaerdier() {
  useDocumentTitle(routes.vaerdier.title);

  return (
    <div className="enter">
      <section className="shell section--loose section--flush-bottom">
        <h1 className="title-page">
          Værdier og <em className="title-em">pædagogik</em>
        </h1>
        <p className="lead lead--page">
          Jeg skriver det som jeg ville sige det til jer i køkkenet — ikke som en politik,
          I skal skrive under på.
        </p>
      </section>

      <section className="shell section--loose section--flush-top">
        {values.map((value) => (
          <article key={value.number} className="vaerdi">
            <div className="vaerdi__head">
              <span className="vaerdi__badge" aria-hidden="true">
                {value.number}
              </span>
              <h2 className="vaerdi__heading">{value.title}</h2>
            </div>
            <div>
              <p className="prose vaerdi__body">{value.body}</p>
              <p className="vaerdi__example">{value.example}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
