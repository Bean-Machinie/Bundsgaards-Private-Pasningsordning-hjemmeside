import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import Hamburger from 'hamburger-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MotionConfig, motion, type Variants } from 'motion/react';

import { site } from '../content/site';
import { scrollToContact } from '../lib/scrollToContact';
import { mobileNav, primaryNav, routes, type NavMenuEntry } from '../routes';
import titleImage from '../assets/images/title-images/title-image-lockup-green.png';

import './Header.css';

interface HighlightState {
  x: number;
  width: number;
  visible: boolean;
}

const HIDDEN_HIGHLIGHT: HighlightState = { x: 0, width: 0, visible: false };

/** NavLink promoted to a motion component so it can join variant staggers. */
const MotionNavLink = motion.create(NavLink);

/* — dropdown choreography ————————————————————————————————————————
   The panel unfurls (scaleY from the tail) before its entries cascade in;
   closing reverses the order — entries retreat first, then the panel folds.
   `staggerChildren` on the panel orchestrates the entries, and each entry is
   the smallest animated unit there is: its icon is plain DOM inside it, so the
   mark and its label fade and settle as one thing, on one timing. (The icons
   used to be variant children of their own, which made them a third phase —
   they waited for the row, then scaled up after it.)

   Because the phases run in sequence, the felt duration is the sum of them:
   panel, then one stagger step per entry, then the last entry's own move. The
   numbers are therefore small — a menu has to answer the click, so the whole
   sequence lands in about 0.3s opening and 0.2s closing, and the ordering
   reads as crispness rather than as steps. */

const menuPanelVariants: Variants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.13,
      ease: [0.34, 1.56, 0.64, 1],
      when: 'beforeChildren',
      staggerChildren: 0.028,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1],
      when: 'afterChildren',
      staggerChildren: 0.018,
    },
  },
};

/* Entries drop a few pixels into place. The offset stays smaller than the
   panel's top inset so half-faded text never pokes past the border. */
const menuItemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.11, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.07 },
  },
};

/* — drawer choreography ——————————————————————————————————————————
   Same grammar as the dropdown, tuned for a full-width sheet: the panel
   unrolls from under the bar, then the links cascade. Stagger is tighter
   than the dropdown's because the drawer lists every page.

   Eight rows is what makes the sum dangerous here — every stagger step is paid
   eight times over, which is why this used to take the best part of a second to
   open. So the opening cascade doesn't wait for the panel at all: `delayChildren`
   starts the links just behind the unrolling edge instead of after it, which
   keeps the panel-then-links reading while overlapping the two phases. Closing
   keeps the strict reverse order, but at a step size small enough that eight of
   them still cost less than a tenth of a second. */

const drawerPanelVariants: Variants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.16,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.05,
      staggerChildren: 0.018,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      duration: 0.11,
      ease: [0.4, 0, 1, 1],
      when: 'afterChildren',
      staggerChildren: 0.012,
    },
  },
};

const drawerItemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.13, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.07 },
  },
};

/**
 * Closing a dropdown on pointerdown means the panel is gone before the click
 * completes — so the click would land on whatever is now under the cursor and
 * activate it. This registers a one-shot capture-phase listener that swallows
 * that single stray click; the timeout is a safety valve in case no click ever
 * arrives (drag off-window, right-click).
 */
function swallowNextClick() {
  const cleanup = () => {
    document.removeEventListener('click', handler, true);
    window.clearTimeout(timer);
  };
  const handler = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    cleanup();
  };
  document.addEventListener('click', handler, true);
  const timer = window.setTimeout(cleanup, 500);
}

/** The drawer flattens nav menus into a group label + indented page links.
 *  Pages coming from a menu keep their dropdown icon, so the card reads as
 *  the same component as the desktop dropdown. */
type DrawerEntry =
  | { type: 'group'; key: string; label: string }
  | {
      type: 'page';
      key: string;
      label: string;
      to: string;
      indent: boolean;
      Icon?: NavMenuEntry['Icon'];
    };

const drawerEntries: DrawerEntry[] = mobileNav.flatMap<DrawerEntry>((item) =>
  item.kind === 'link'
    ? [
        {
          type: 'page',
          key: item.route,
          label: routes[item.route].longLabel,
          to: routes[item.route].path,
          indent: false,
        },
      ]
    : [
        { type: 'group', key: `menu:${item.id}`, label: item.label },
        ...item.items.map<DrawerEntry>(({ route, Icon }) => ({
          type: 'page',
          key: route,
          label: routes[route].navLabel ?? routes[route].longLabel,
          to: routes[route].path,
          indent: true,
          Icon,
        })),
      ],
);

/** reducedMotion="user" strips the transform choreography (but keeps fades)
 *  for people who ask the OS for less motion — the counterpart of the CSS
 *  prefers-reduced-motion block covering the remaining transitions. */
export default function Header() {
  return (
    <MotionConfig reducedMotion="user">
      <HeaderInner />
    </MotionConfig>
  );
}

function HeaderInner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [highlight, setHighlight] = useState<HighlightState>(HIDDEN_HIGHLIGHT);
  // `settling` picks the return easing — a springy overshoot when the wash
  // bounces back to the active item, versus a smooth slide on hover.
  const [settling, setSettling] = useState(false);
  // One nullable id rather than a boolean per dropdown: opening one menu
  // structurally closes any other, because there is only one slot.
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Ref registries keyed by menu id — for measuring/refocusing the trigger
  // and for focusing into the open panel. Callback refs delete on unmount so
  // the maps never hold stale nodes.
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const menuRefs = useRef(new Map<string, HTMLDivElement>());
  // A transient one-shot signal, not state: set by keyboard-opens, consumed by
  // the focus effect after the panel exists, and it must not cause a render.
  const focusFirstItemRef = useRef(false);
  const { pathname } = useLocation();
  const menuId = useId();

  // Navigating from inside the drawer or a dropdown should close it.
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenuId(null);
  }, [pathname]);

  // A shadow appears once the page has scrolled, lifting the panel off the
  // content beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the drawer. No body scroll lock: the menu is a floating
  // card (like the desktop dropdown), and yanking the scrollbar away caused
  // a visible layout jump every time it opened.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Pressing anywhere outside the nav dismisses an open dropdown. Attached
  // only while one is open, and on pointerdown rather than click so the panel
  // is gone before the press completes — with the stray click swallowed.
  useEffect(() => {
    if (!openMenuId) return;

    const onPointerDown = (event: PointerEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        swallowNextClick();
        setOpenMenuId(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openMenuId]);

  // Keyboard opens want focus inside the panel — but the panel doesn't exist
  // until after the open re-render, so the keydown handler only sets a flag
  // and this effect does the focusing. Mouse opens leave the flag unset.
  useEffect(() => {
    if (!openMenuId || !focusFirstItemRef.current) return;
    focusFirstItemRef.current = false;
    menuRefs.current
      .get(openMenuId)
      ?.querySelector<HTMLElement>('[role="menuitem"]')
      ?.focus();
  }, [openMenuId]);

  const toggleMenu = useCallback((id: string) => {
    setOpenMenuId((current) => (current === id ? null : id));
  }, []);

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
  // pointer leaves. On a page with no nav item active — the front page, or a
  // dropdown child page like /vaerdier — it just fades away.
  const settleToActive = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    // An open dropdown pins the wash on its trigger — the pointer wandering
    // off (into the panel or elsewhere) shouldn't drop the highlight while
    // the menu it belongs to is still showing.
    if (openMenuId) {
      const trigger = triggerRefs.current.get(openMenuId);
      if (trigger) {
        positionAt(trigger, true);
        return;
      }
    }
    const active = list.querySelector<HTMLElement>('.site-nav__link.active');
    if (active) {
      positionAt(active, true);
    } else {
      setSettling(false);
      setHighlight((h) => ({ ...h, visible: false }));
    }
  }, [openMenuId, positionAt]);

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

  const onTriggerKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'ArrowDown') {
      // Stop the page scrolling; open and focus the first entry. Enter and
      // Space need no handling — a real <button> turns them into click.
      event.preventDefault();
      focusFirstItemRef.current = true;
      setOpenMenuId(id);
    } else if (event.key === 'Escape' && openMenuId === id) {
      setOpenMenuId(null);
    }
  };

  const onPanelKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Escape') {
      // Return focus to the trigger — otherwise it falls to <body> when the
      // focused entry unmounts. stopPropagation so no ancestor sees the same
      // Escape twice.
      event.stopPropagation();
      setOpenMenuId(null);
      triggerRefs.current.get(id)?.focus();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const panel = menuRefs.current.get(id);
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]'));
      if (items.length === 0) return;
      const index = items.indexOf(document.activeElement as HTMLElement);
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next =
        index === -1
          ? items[delta === 1 ? 0 : items.length - 1]
          : items[(index + delta + items.length) % items.length];
      next.focus();
    }
  };

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
            {primaryNav.map((item) =>
              item.kind === 'link' ? (
                <li
                  key={item.route}
                  className="site-nav__item"
                  onMouseEnter={(event) => positionAt(event.currentTarget, false)}
                >
                  <NavLink to={routes[item.route].path} className="site-nav__link">
                    {routes[item.route].navLabel}
                  </NavLink>
                </li>
              ) : (
                // Click-only: hovering slides the wash here like any item,
                // but the menu opens on click and stays open until an
                // outside press, Escape, a navigation or another toggle.
                <li
                  key={item.id}
                  className="site-nav__item site-nav__item--menu"
                  onMouseEnter={(event) => positionAt(event.currentTarget, false)}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) triggerRefs.current.set(item.id, el);
                      else triggerRefs.current.delete(item.id);
                    }}
                    className="site-nav__link site-nav__trigger"
                    aria-haspopup="menu"
                    aria-expanded={openMenuId === item.id}
                    onClick={(event) => {
                      // detail 0 means the click came from Enter/Space — a
                      // keyboard open should land focus inside the panel.
                      if (event.detail === 0 && openMenuId !== item.id) {
                        focusFirstItemRef.current = true;
                      }
                      toggleMenu(item.id);
                    }}
                    onKeyDown={(event) => onTriggerKeyDown(event, item.id)}
                  >
                    {item.label}
                    <span
                      className={`site-nav__chevron${
                        openMenuId === item.id ? ' site-nav__chevron--open' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {/* Kept mounted so the close choreography can play; `inert`
                      makes the folded panel unreachable by tab, pointer and
                      screen reader, which is what conditional rendering used
                      to provide. */}
                  <div
                    className="site-nav__menu"
                    inert={openMenuId !== item.id}
                    onKeyDown={(event) => onPanelKeyDown(event, item.id)}
                  >
                    <motion.div
                      className="site-nav__menu-panel"
                      role="menu"
                      aria-label={item.label}
                      initial="closed"
                      animate={openMenuId === item.id ? 'open' : 'closed'}
                      variants={menuPanelVariants}
                      ref={(el) => {
                        if (el) menuRefs.current.set(item.id, el);
                        else menuRefs.current.delete(item.id);
                      }}
                    >
                      {item.items.map(({ route, Icon }) => (
                        <MotionNavLink
                          key={route}
                          to={routes[route].path}
                          role="menuitem"
                          className="site-nav__menu-link"
                          variants={menuItemVariants}
                          onClick={() => setOpenMenuId(null)}
                        >
                          {Icon && (
                            <span className="site-nav__menu-icon">
                              <Icon size={17} />
                            </span>
                          )}
                          {routes[route].navLabel}
                        </MotionNavLink>
                      ))}
                    </motion.div>
                  </div>
                </li>
              ),
            )}
          </ul>
          {/* Kontakt is the header's one CTA: a filled button outside the
              sliding wash, scrolling to the footer (the contact section)
              rather than routing anywhere. */}
          <a href="#kontakt" className="btn site-nav__cta" onClick={scrollToContact}>
            Kontakt
          </a>
        </nav>

        <div className="menu-toggle">
          <Hamburger
            toggled={menuOpen}
            toggle={setMenuOpen}
            label={menuOpen ? 'Luk menu' : 'Åbn menu'}
          />
        </div>
      </div>

      {/* Mobile menu — a floating card in the desktop dropdown's grammar,
          kept mounted so it can animate both ways. The backdrop is an
          invisible full-screen click-catcher: pressing anywhere off the
          card closes it, same as the dropdown's outside-press dismissal. */}
      <div className={`site-menu${menuOpen ? ' is-open' : ''}`} id={menuId}>
        <button
          type="button"
          className="site-menu__backdrop"
          aria-label="Luk menu"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
        <motion.nav
          className="site-menu__panel"
          aria-label="Menu"
          initial="closed"
          animate={menuOpen ? 'open' : 'closed'}
          variants={drawerPanelVariants}
        >
          {drawerEntries.map((entry) =>
            entry.type === 'group' ? (
              <motion.span
                key={entry.key}
                className="site-menu__group"
                variants={drawerItemVariants}
              >
                {entry.label}
              </motion.span>
            ) : (
              <MotionNavLink
                key={entry.key}
                to={entry.to}
                className={`site-menu__link${entry.indent ? ' site-menu__link--sub' : ''}`}
                variants={drawerItemVariants}
                end
              >
                {entry.Icon && (
                  <span className="site-nav__menu-icon">
                    <entry.Icon size={17} />
                  </span>
                )}
                {entry.label}
              </MotionNavLink>
            ),
          )}
          <motion.a
            href="#kontakt"
            className="site-menu__link"
            variants={drawerItemVariants}
            onClick={(event) => {
              scrollToContact(event);
              setMenuOpen(false);
            }}
          >
            Kontakt
          </motion.a>
        </motion.nav>
      </div>
    </header>
  );
}
