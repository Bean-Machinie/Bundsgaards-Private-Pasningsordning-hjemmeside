import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { site } from '../content/site';
import { mobileNav, primaryNav, routes } from '../routes';
import { CloseIcon, MenuIcon } from './Icons';
import titleImage from '../assets/images/title-images/title-image-short-green.png';

import './Header.css';

interface HighlightState {
  x: number;
  width: number;
  visible: boolean;
}

const HIDDEN_HIGHLIGHT: HighlightState = { x: 0, width: 0, visible: false };

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [highlight, setHighlight] = useState<HighlightState>(HIDDEN_HIGHLIGHT);
  const listRef = useRef<HTMLUListElement>(null);
  const { pathname } = useLocation();
  const menuId = useId();

  // Navigating from inside the drawer should close it.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // A shadow appears once the page has scrolled, lifting the panel off the
  // content beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  // The sliding highlight is one element measured against the live DOM, so it
  // needs no knowledge of the items' labels, widths or count — add a nav item
  // and it just works. `scrollLeft` keeps it aligned if the list ever scrolls.
  const moveHighlightTo = useCallback((el: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;
    const rect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setHighlight({
      x: rect.left - listRect.left + list.scrollLeft,
      width: rect.width,
      visible: true,
    });
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__bar shell">
        <Link
          to={routes.forside.path}
          className="brand"
          aria-label={`${site.name} — forside`}
        >
          <img
            className="brand__logo"
            src={titleImage}
            alt={`${site.name} — ${site.tagline}`}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
          />
        </Link>

        <nav className="site-nav" aria-label="Hovedmenu">
          <ul
            className="site-nav__list"
            ref={listRef}
            onMouseLeave={() => setHighlight((h) => ({ ...h, visible: false }))}
          >
            <span
              className="site-nav__highlight"
              aria-hidden="true"
              style={{
                transform: `translateX(${highlight.x}px)`,
                width: `${highlight.width}px`,
                opacity: highlight.visible ? 1 : 0,
              }}
            />
            {primaryNav.map((key) => (
              <li
                key={key}
                className="site-nav__item"
                onMouseEnter={(event) => moveHighlightTo(event.currentTarget)}
              >
                <NavLink to={routes[key].path} className="site-nav__link">
                  {routes[key].navLabel}
                </NavLink>
              </li>
            ))}
          </ul>
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
          {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Overlay drawer — kept mounted so it can animate both ways; it sits
          above the page rather than pushing it. */}
      <div className={`site-menu${menuOpen ? ' is-open' : ''}`} id={menuId}>
        <button
          type="button"
          className="site-menu__backdrop"
          aria-label="Luk menu"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
        <nav className="site-menu__panel" aria-label="Menu">
          {mobileNav.map((key, index) => (
            <NavLink
              key={key}
              to={routes[key].path}
              className="site-menu__link"
              style={{ transitionDelay: menuOpen ? `${0.04 * index + 0.05}s` : '0s' }}
              end
            >
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
    </header>
  );
}
