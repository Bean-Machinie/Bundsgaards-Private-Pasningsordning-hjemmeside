import { Link } from 'react-router-dom';

import { fullAddress, site } from '../content/site';
import { footerNav, routes } from '../routes';

import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__cols shell">
        <div>
          <div className="site-footer__brand">{site.name}</div>
          <p className="site-footer__blurb">
            Privat pasningsordning for {site.childCount} børn i alderen {site.ageRange}.
            Godkendt af {site.municipality}.
          </p>
        </div>

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
          <span>{site.owner}</span>
          <span>{fullAddress}</span>
          <a href={`tel:${site.phoneHref}`} className="site-footer__link site-footer__link--accent">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="site-footer__link site-footer__link--accent">
            {site.email}
          </a>
        </div>

        <div>
          <span className="site-footer__label site-footer__label--block">Pladser</span>
          <p className="site-footer__availability">
            <span className="site-footer__dot" aria-hidden="true" />
            {site.availability}
          </p>
          <Link to={routes.kontakt.path} className="btn btn-primary">
            Book et besøg
          </Link>
        </div>
      </div>

      <div className="site-footer__legal shell">
        <span>
          © {year} {site.name} Privatpasningsordning
        </span>
        <span>Fotos indsættes senere · Persondatapolitik</span>
      </div>
    </footer>
  );
}
