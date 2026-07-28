import Backdrop from '../components/Backdrop';
import { values } from '../content/values';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { routes } from '../routes';

import './Vaerdier.css';

export default function Vaerdier() {
  useDocumentTitle(routes.vaerdier.title);

  return (
    <div className="enter">
      {/* Title, lead and the whole grid live in one section, the way the Om
          page does it — that section is what the printed backdrop hangs on, and
          it has to reach the footer for the picture's bottom to be hidden. */}
      <section className="shell section vaerdier">
        <Backdrop variant="welcome" />

        <h1 className="title-page">
          Værdier og <em className="title-em">pædagogik</em>
        </h1>
        <p className="lead lead--page">
          Jeg skriver det som jeg ville sige det til jer i køkkenet — ikke som en politik,
          I skal skrive under på.
        </p>

        {/* The front page's values grid, carried straight over: the same
            handwritten terracotta title standing above its own text, the same
            body voice, two to a row — six values here instead of four. */}
        <div className="vaerdi-grid">
          {values.map((value) => (
            <article key={value.title} className="vaerdi">
              <h2 className="vaerdi__heading">{value.title}</h2>
              <p className="vaerdi__body">{value.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
