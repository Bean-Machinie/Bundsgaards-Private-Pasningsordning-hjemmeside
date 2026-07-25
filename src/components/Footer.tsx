import { Link } from 'react-router-dom';

import { fullAddress, site } from '../content/site';
import { footerNav, routes } from '../routes';
import titleImage from '../assets/images/title-images/title-image-short-cream.png';

import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
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
          <nav className="site-footer__col" aria-label="Sider">
            <span className="site-footer__label">Sider</span>
            {footerNav.map((key) => (
              <Link key={key} to={routes[key].path} className="site-footer__link">
                {routes[key].longLabel}
              </Link>
            ))}
          </nav>

          <div className="site-footer__col">
            <span className="site-footer__label">Kontakt</span>
            <span className="site-footer__strong">{site.owner}</span>
            <span>{fullAddress}</span>
            <a href={`tel:${site.phoneHref}`} className="site-footer__link">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="site-footer__link">
              {site.email}
            </a>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__label">Åbningstider</span>
            <span>Mandag – fredag</span>
            <span className="site-footer__hours">6.00 – 15.30</span>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__label">Godkendt af</span>
            <span className="site-footer__strong">{site.municipality}</span>
            <span className="site-footer__muted">
              Aftale om privat pasning gennem kommunen.
            </span>
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="shell site-footer__legal-inner">
          <span>
            © {year} {site.name} Privatpasningsordning
          </span>
          <span className="site-footer__legal-by">
            {site.owner} · {site.city}
          </span>
        </div>
      </div>
    </footer>
  );
}
