import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { heroCtaPath, heroSlides } from '../content/heroSlides';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

import './HeroCarousel.css';

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 48;
/** Must match the track's transition duration in HeroCarousel.css. */
const TRANSITION_MS = 620;

/**
 * The front-page hero.
 *
 * A slide track that loops seamlessly: the rendered strip is
 * [clone of last, …slides, clone of first], so advancing past the end lands on
 * a clone that looks identical to the real first slide, and we then snap back
 * without a transition on transitionend. `pos` is the index into that extended
 * strip (starts at 1, the real first slide).
 *
 * Autoplay is a self-re-arming timeout keyed on `timerKey`: every interaction —
 * arrow, dot, swipe — and every auto-advance bumps the key, which tears down
 * the pending timeout and starts a fresh countdown. So any interaction buys a
 * full interval rather than inheriting whatever was left, and there is no
 * interval that could fire mid-gesture.
 */
export default function HeroCarousel() {
  const count = heroSlides.length;
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  // Live drag offset in px, layered on top of the % transform.
  const [dragPx, setDragPx] = useState(0);
  const dragRef = useRef<{ startX: number; active: boolean }>({ startX: 0, active: false });

  const slideWidthPct = 100 / (count + 2);
  const currentSlide = ((pos - 1) % count + count) % count;

  const resetTimer = useCallback(() => setTimerKey((k) => k + 1), []);

  const advance = useCallback((dir: 1 | -1) => {
    setAnimate(true);
    setPos((p) => p + dir);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setAnimate(true);
      setPos(index + 1);
      resetTimer();
    },
    [resetTimer],
  );

  const next = useCallback(() => {
    advance(1);
    resetTimer();
  }, [advance, resetTimer]);

  const prev = useCallback(() => {
    advance(-1);
    resetTimer();
  }, [advance, resetTimer]);

  // Autoplay — pauses when the tab is hidden or the user prefers reduced motion.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;

    const id = window.setTimeout(() => {
      advance(1);
      setTimerKey((k) => k + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [timerKey, advance]);

  // Re-arm autoplay when the tab becomes visible again (it stays parked while
  // hidden, so it doesn't race ahead in a background tab).
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) resetTimer();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [resetTimer]);

  // Seamless wrap: once a transition into a clone has had time to finish, snap
  // onto the matching real slide with the transition disabled so the jump is
  // invisible. Driven by a timeout rather than `transitionend` so it can't be
  // left stranded if that event doesn't fire.
  useEffect(() => {
    if (pos !== 0 && pos !== count + 1) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setPos(pos === 0 ? count : 1);
    }, TRANSITION_MS + 20);
    return () => window.clearTimeout(id);
  }, [pos, count]);

  // — drag / swipe ————————————————————————————————————————————————
  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { startX: event.clientX, active: true };
    setAnimate(false);
    resetTimer();
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    setDragPx(event.clientX - dragRef.current.startX);
  };
  const endDrag = (event: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    setDragPx(0);
    setAnimate(true);
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      advance(dx < 0 ? 1 : -1);
      resetTimer();
    }
  };

  const trackStyle: CSSProperties = {
    width: `${(count + 2) * 100}%`,
    transform: `translate3d(calc(${(-pos * slideWidthPct).toFixed(4)}% + ${dragPx}px), 0, 0)`,
    transition: animate ? undefined : 'none',
  };

  // Extended strip: last clone, real slides, first clone.
  const strip = [heroSlides[count - 1], ...heroSlides, heroSlides[0]];

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Bundsgård">
      <div
        className="hero-carousel__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div className="hero-carousel__track" style={trackStyle}>
          {strip.map((slide, i) => {
            // Only the currently-shown real slide is exposed to the a11y tree.
            const realIndex = ((i - 1) % count + count) % count;
            const isCurrent = i >= 1 && i <= count && realIndex === currentSlide;
            return (
              <div
                className="hero-carousel__slide"
                key={i}
                aria-hidden={!isCurrent}
                style={{ width: `${slideWidthPct}%` }}
              >
                <img
                  className="hero-carousel__img"
                  src={slide.image}
                  alt={slide.alt}
                  draggable={false}
                  loading={i === 1 ? 'eager' : 'lazy'}
                />
                <div className="hero-carousel__overlay" aria-hidden="true" />
                <div className="hero-carousel__content">
                  <span className="hero-carousel__kicker">{slide.kicker}</span>
                  <h1 className="hero-carousel__headline">
                    {slide.headline}
                    <em className="hero-carousel__highlight">{slide.highlight}</em>
                  </h1>
                  <p className="hero-carousel__subtext">{slide.subtext}</p>
                  <Link
                    to={heroCtaPath(slide.ctaTo)}
                    className="btn btn-primary btn--lg hero-carousel__cta"
                    tabIndex={isCurrent ? 0 : -1}
                  >
                    {slide.ctaLabel}
                    <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="hero-carousel__arrow hero-carousel__arrow--prev"
          aria-label="Forrige billede"
          onClick={prev}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <button
          type="button"
          className="hero-carousel__arrow hero-carousel__arrow--next"
          aria-label="Næste billede"
          onClick={next}
        >
          <ChevronRightIcon size={20} />
        </button>

        <div className="hero-carousel__dots" role="tablist" aria-label="Vælg billede">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Billede ${i + 1} af ${count}`}
              className={
                i === currentSlide
                  ? 'hero-carousel__dot hero-carousel__dot--active'
                  : 'hero-carousel__dot'
              }
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
