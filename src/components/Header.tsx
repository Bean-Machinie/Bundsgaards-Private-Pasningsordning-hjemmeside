import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { site } from '../content/site';
import { mobileNav, primaryNav, routes } from '../routes';

import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const menuId = useId();

  // Navigating from inside the drawer should close it.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the drawer, and the body shouldn't scroll behind it.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__bar shell">
        <Link to={routes.forside.path} className="brand" aria-label={`${site.name} — forside`}>
          <span className="brand__name">{site.name}</span>
          <span className="brand__tagline">{site.tagline}</span>
        </Link>

        <nav className="site-nav" aria-label="Hovedmenu">
          {primaryNav.map((key) => (
            <NavLink key={key} to={routes[key].path} className="site-nav__link">
              {routes[key].navLabel}
            </NavLink>
          ))}
          <Link to={routes.kontakt.path} className="btn btn-primary site-nav__cta">
            Book et besøg
          </Link>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {menuOpen && (
        <div className="site-menu" id={menuId}>
          <nav className="site-menu__inner shell" aria-label="Menu">
            {mobileNav.map((key) => (
              <NavLink key={key} to={routes[key].path} className="site-menu__link" end>
                {routes[key].longLabel}
              </NavLink>
            ))}
            <Link
              to={routes.kontakt.path}
              className="btn btn-primary btn-block site-menu__cta"
            >
              Book et besøg
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
