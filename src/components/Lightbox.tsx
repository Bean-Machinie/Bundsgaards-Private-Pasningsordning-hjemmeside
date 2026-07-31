import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import KeenSlider, { type KeenSliderInstance } from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

import type { GalleryItem } from '../content/photos';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons';

import './Lightbox.css';

interface LightboxProps {
  items: GalleryItem[];
  /** Which photo to open on — the tile that was clicked. */
  startIndex: number;
  onClose: () => void;
}

/** Everything the trap has to cycle through — the three controls, in DOM order. */
const FOCUSABLE = 'button';

/** Slides within one step of the open one, the loop counted the short way
 *  round. These are fetched at once; the rest wait to be approached. Stepping
 *  through the gallery then never waits on a download, and opening it never
 *  pulls fourteen full-size photographs to show one. */
function isNear(index: number, current: number, count: number): boolean {
  const straight = Math.abs(index - current);
  return Math.min(straight, count - straight) <= 1;
}

/**
 * One photograph in the viewer.
 *
 * Its own component for its own `loaded` flag: a photo fades up when it has
 * decoded rather than painting in bands down the frame, and each slide needs
 * to track that separately.
 *
 * `sizes="90vw"` is what makes the picture arrive quickly: for a Drive-hosted
 * photo it puts the browser near the top of the same rendition ladder the
 * mosaic reads from the bottom of, so the viewer gets a sharp copy without
 * anyone downloading the caretaker's original 6 MB upload.
 */
function LightboxPhoto({ photo, priority }: { photo: GalleryItem; priority: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Already in cache — mark it before the first paint so it doesn't fade in
  // from nothing on a second visit to the same slide.
  useLayoutEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      className={loaded ? 'lightbox__img is-loaded' : 'lightbox__img'}
      src={photo.full ?? photo.src ?? undefined}
      srcSet={photo.srcSet}
      sizes={photo.srcSet ? '90vw' : undefined}
      alt={photo.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
    />
  );
}

/**
 * Full-screen photo viewer.
 *
 * The motion engine is keen-slider — the same library that drives the front-page
 * hero, so real pointer/touch dragging, a seamless `loop` and the arrow/keyboard
 * controls all come from a dependency the site already ships, rather than from a
 * third-party lightbox with its own stylesheet to fight.
 *
 * Mounted only while open (the parent renders it conditionally), which is what
 * lets keen-slider measure a laid-out track: it is created in an effect on mount
 * and destroyed on unmount, exactly as in HeroCarousel.
 *
 * Modal behaviour is hand-rolled rather than delegated to <dialog>, because the
 * dialog element's own backdrop and sizing would have to be undone before this
 * could be full-bleed: Escape closes, arrows step, the page behind is locked
 * from scrolling, focus is trapped between the three controls, and the element
 * that opened the viewer gets focus back on close.
 *
 * Rendered through a portal on <body>. Page content sits inside `.enter`, whose
 * entry animation puts a transform on the element — and a transformed ancestor
 * becomes the containing block for `position: fixed`, which would anchor this
 * to the page instead of the viewport. Out of the tree, that can't happen.
 */
export default function Lightbox({ items, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const instanceRef = useRef<KeenSliderInstance | null>(null);
  /** Where the last press landed, so a drag-release isn't read as a click. */
  const pressRef = useRef<{ x: number; y: number } | null>(null);

  const prev = useCallback(() => instanceRef.current?.prev(), []);
  const next = useCallback(() => instanceRef.current?.next(), []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const slider = new KeenSlider(node, {
      loop: true,
      initial: startIndex,
      slideChanged(s) {
        setCurrent(s.track.details.rel);
      },
    });
    instanceRef.current = slider;

    // Same reason as the hero: on the first frame the track can measure before
    // its final size is resolved, which leaves it unable to advance.
    const raf = requestAnimationFrame(() => slider.update());

    return () => {
      cancelAnimationFrame(raf);
      slider.destroy();
      instanceRef.current = null;
    };
    // Deliberately empty: startIndex is the opening position only, and
    // re-running this would tear down the slider mid-gesture.
  }, []);

  // The page behind must not scroll while the viewer is up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Take focus on open, hand it back to the tile that opened us on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  // Escape closes, arrows step, Tab cycles inside the viewer instead of walking
  // off into the page behind it.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        prev();
        return;
      }
      if (event.key === 'ArrowRight') {
        next();
        return;
      }
      if (event.key !== 'Tab') return;

      const stops = rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!stops || stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [next, onClose, prev]);

  /** A press that stayed put outside the photo closes the viewer; a drag doesn't. */
  const onBackdropClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.lightbox__figure, .lightbox__btn')) return;

    const press = pressRef.current;
    if (press) {
      const travelled = Math.hypot(event.clientX - press.x, event.clientY - press.y);
      if (travelled > 10) return;
    }
    onClose();
  };

  const item = items[current];

  return createPortal(
    <div
      ref={rootRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Billedviser"
      onPointerDown={(event) => {
        pressRef.current = { x: event.clientX, y: event.clientY };
      }}
      onClick={onBackdropClick}
    >
      <div className="lightbox__bar">
        <span className="lightbox__counter">
          {current + 1} / {items.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          className="lightbox__btn lightbox__btn--close"
          aria-label="Luk billedviser"
          onClick={onClose}
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <div ref={trackRef} className="keen-slider lightbox__track">
        {items.map((photo, index) => (
          <div className="keen-slider__slide lightbox__slide" key={`${index}-${photo.caption}`}>
            <figure className="lightbox__figure">
              {photo.src ? (
                <LightboxPhoto
                  photo={photo}
                  priority={isNear(index, current, items.length)}
                />
              ) : (
                <span className="lightbox__placeholder">{photo.placeholder}</span>
              )}
              <figcaption className="lightbox__caption">{photo.caption}</figcaption>
            </figure>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--prev"
            aria-label="Forrige billede"
            onClick={prev}
          >
            <ChevronLeftIcon size={22} />
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--next"
            aria-label="Næste billede"
            onClick={next}
          >
            <ChevronRightIcon size={22} />
          </button>
        </>
      )}

      {/* The live caption for assistive tech — the visible one rides along with
          its own slide, where a screen reader would only ever meet one of many. */}
      <span className="lightbox__live" aria-live="polite">
        {item?.caption}
      </span>
    </div>,
    document.body,
  );
}
