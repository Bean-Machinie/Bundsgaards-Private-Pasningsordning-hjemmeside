import { Link } from 'react-router-dom';

import { fullAddress, site } from '../content/site';
import { footerNav, routes } from '../routes';

import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const isFull = site.availability === 'Venteliste';

  return (
    <footer className="site-footer">
      <div className="site-footer__wordmark shell">
        <p>{site.name}</p>
      </div>

      <div className="site-footer__cols shell">
        <div>
          <span className="site-footer__label">Om stedet</span>
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
          <a href={`tel:${site.phoneHref}`} className="site-footer__link">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="site-footer__link">
            {site.email}
          </a>
        </div>

        <div>
          <span className="site-footer__label">Åbent</span>
          <p className="site-footer__hours">Mandag–fredag</p>
          <p className="site-footer__hours-value">6.00 – 15.30</p>
          <p className="site-footer__availability">
            <span
              className={`site-footer__dot${isFull ? ' site-footer__dot--full' : ''}`}
              aria-hidden="true"
            />
            {site.availability}
          </p>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="site-footer__legal-inner shell">
          © {year} {site.name} Privatpasningsordning
        </div>
      </div>
    </footer>
  );
}
