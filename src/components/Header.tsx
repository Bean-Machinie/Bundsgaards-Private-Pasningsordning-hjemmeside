import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { site } from '../content/site';
import { scrollToContact } from '../lib/scrollToContact';
import { mobileNav, primaryNav, routes } from '../routes';
import { CloseIcon, MenuIcon } from './Icons';
import titleImage from '../assets/images/title-images/title-image-lockup-green.png';

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
  // `settling` picks the return easing — a springy overshoot when the wash
  // bounces back to the active item, versus a smooth slide on hover.
  const [settling, setSettling] = useState(false);
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
  // `bounce` chooses the easing: a smooth slide on hover, a springy overshoot
  // when settling back onto the active item.
  const positionAt = useCallback((el: HTMLElement, bounce: boolean) => {
    const list = listRef.current;
    if (!list) return;
    const rect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setSettling(bounce);
    setHighlight({
      x: rect.left - listRect.left + list.scrollLeft,
      width: rect.width,
      visible: true,
    });
  }, []);

  // The highlight's home is the active route's item: it rests there, follows
  // the pointer to whatever item is hovered, and springs back here when the
  // pointer leaves. On a page with no nav item active (the front page) it just
  // fades away.
  const settleToActive = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('.site-nav__link.active');
    if (active) {
      positionAt(active, true);
    } else {
      setSettling(false);
      setHighlight((h) => ({ ...h, visible: false }));
    }
  }, [positionAt]);

  // Place the highlight on the active item before the browser paints, so it is
  // simply *there* on load and on navigation — no intro animation — then keep
  // it aligned as fonts finish loading or the window resizes. Measuring in a
  // layout effect (rather than rAF) means it settles even before the first
  // composited frame.
  useLayoutEffect(() => {
    settleToActive();
  }, [pathname, settleToActive]);

  useEffect(() => {
    const onResize = () => settleToActive();
    window.addEventListener('resize', onResize);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) settleToActive();
    });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelled = true;
    };
  }, [settleToActive]);

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
            onMouseLeave={settleToActive}
          >
            <span
              className="site-nav__highlight"
              aria-hidden="true"
              data-settling={settling}
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
                onMouseEnter={(event) => positionAt(event.currentTarget, false)}
              >
                <NavLink to={routes[key].path} className="site-nav__link">
                  {routes[key].navLabel}
                </NavLink>
              </li>
            ))}
            {/* Kontakt is a peer of the other items, not a CTA: it scrolls to
                the footer (the contact section) rather than routing anywhere. */}
            <li
              className="site-nav__item"
              onMouseEnter={(event) => positionAt(event.currentTarget, false)}
            >
              <a href="#kontakt" className="site-nav__link" onClick={scrollToContact}>
                Kontakt
              </a>
            </li>
          </ul>
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
          <a
            href="#kontakt"
            className="site-menu__link"
            style={{
              transitionDelay: menuOpen ? `${0.04 * mobileNav.length + 0.05}s` : '0s',
            }}
            onClick={(event) => {
              scrollToContact(event);
              setMenuOpen(false);
            }}
          >
            Kontakt
          </a>
        </nav>
      </div>
    </header>
  );
}
