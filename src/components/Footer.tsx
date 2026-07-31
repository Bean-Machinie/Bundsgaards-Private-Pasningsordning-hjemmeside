import { Link } from 'react-router-dom';

import { FAQ_ANCHOR } from '../content/faqs';
import { fullAddress, hoursOf, openingHours, site } from '../content/site';
import { footerNav, routes } from '../routes';
import titleImage from '../assets/images/title-images/title-image-short-cream.png';

import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  // Keyless satellite embed built from the address in site.ts, so the pin
  // follows the source of truth. `t=k` selects the satellite ("Keyhole") view.
  const mapQuery = encodeURIComponent(fullAddress);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=k&z=17&output=embed`;

  return (
    <footer className="site-footer" id="kontakt">
      <div className="shell site-footer__inner">
        {/* The wordmark floats inside a fixed-height slot, so resizing or
            shifting it never nudges the columns below — only the image moves. */}
        <div className="site-footer__brand">
          <img
            className="site-footer__wordmark"
            src={titleImage}
            alt={`${site.name} — ${site.tagline}`}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>

        <div className="site-footer__cols">
          <div className="site-footer__text">
            <nav className="site-footer__col" aria-label="Sider">
              <span className="site-footer__label">Sider</span>
              {footerNav.map((key) => (
                <Link key={key} to={routes[key].path} className="site-footer__link">
                  {routes[key].longLabel}
                </Link>
              ))}
              {/* Not a page of its own but the band partway down Praktisk, so it
                  sits after the pages. The hash does the scrolling — ScrollToTop
                  picks it up — which is why this is an ordinary Link and needs no
                  handler of its own. */}
              <Link
                to={`${routes.praktisk.path}#${FAQ_ANCHOR}`}
                className="site-footer__link"
              >
                Ofte stillede spørgsmål
              </Link>
            </nav>

            <div className="site-footer__col">
              <span className="site-footer__label">Kontakt</span>
              <span className="site-footer__strong">{site.owner}</span>
              <a href={`tel:${site.phoneHref}`} className="site-footer__link">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="site-footer__link">
                {site.email}
              </a>
            </div>

            {/* One block per opening row — Friday closes earlier, so a single
                "mandag – fredag" line would be wrong. The blocks keep the
                column's spacing between them and their own tighter spacing
                inside, so each pair reads as one thing. */}
            <div className="site-footer__col">
              <span className="site-footer__label">Åbningstider</span>
              {openingHours.map((row) => (
                <div key={row.days} className="site-footer__hours-row">
                  <span>{row.days}</span>
                  <span className="site-footer__hours">{hoursOf(row)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The location panel takes the fourth column's place but reads as its
              own object: a square satellite map over the address and approval. */}
          <div className="site-footer__place">
            <span className="site-footer__label">Find vej</span>
            <figure className="site-footer__map">
              <iframe
                src={mapEmbedUrl}
                title={`Kort – ${fullAddress}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </figure>
            <address className="site-footer__address">{fullAddress}</address>
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="shell site-footer__legal-inner">
          <span>
            © {year} {site.name} Privatpasningsordning
          </span>
        </div>
      </div>
    </footer>
  );
}
