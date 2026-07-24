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
 * The front-page hero — a sliding carousel that loops seamlessly.
 *
 * The rendered strip is [clone of last, …slides, clone of first]; `pos` is the
 * index into it (starts at 1, the real first slide). Advancing past the end
 * lands on a clone that looks identical to the real slide, then we snap back
 * onto the real one with the transition disabled so the jump is invisible.
 *
 * A single move runs at a time: `movingRef` locks input for the duration of the
 * transition, so however fast the controls are pressed `pos` can only ever step
 * one place and can never run off the strip into empty space. The lock clears
 * on a timeout, which also performs the seamless snap.
 *
 * Autoplay is a self-re-arming timeout keyed on `timerKey`: every interaction
 * and every auto-advance bumps the key, tearing down the pending timeout and
 * starting a fresh countdown. It parks while the tab is hidden.
 */
export default function HeroCarousel() {
  const count = heroSlides.length;
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const movingRef = useRef(false);
  const dragRef = useRef<{ startX: number; active: boolean }>({ startX: 0, active: false });

  const slideWidthPct = 100 / (count + 2);
  const currentSlide = ((pos - 1) % count + count) % count;

  const resetTimer = useCallback(() => setTimerKey((k) => k + 1), []);

  // Every navigation goes through here, so the input lock is honoured in one
  // place. `to` is an index into the extended strip.
  const moveTo = useCallback(
    (to: number) => {
      if (movingRef.current || to === pos) return;
      movingRef.current = true;
      setAnimate(true);
      setPos(to);
      resetTimer();
    },
    [pos, resetTimer],
  );

  const next = useCallback(() => moveTo(pos + 1), [moveTo, pos]);
  const prev = useCallback(() => moveTo(pos - 1), [moveTo, pos]);
  const goTo = useCallback((realIndex: number) => moveTo(realIndex + 1), [moveTo]);

  // When a move finishes: snap off a clone onto its real twin (transition
  // disabled), then release the lock. Driven by a timeout rather than
  // `transitionend` so it can't be left stranded if that event doesn't fire.
  useEffect(() => {
    if (!movingRef.current) return;
    const id = window.setTimeout(() => {
      if (pos === count + 1) {
        setAnimate(false);
        setPos(1);
      } else if (pos === 0) {
        setAnimate(false);
        setPos(count);
      }
      movingRef.current = false;
    }, TRANSITION_MS + 20);
    return () => window.clearTimeout(id);
  }, [pos, count]);

  // Autoplay — parks while the tab is hidden or reduced motion is preferred.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;

    const id = window.setTimeout(() => {
      if (!movingRef.current) {
        movingRef.current = true;
        setAnimate(true);
        setPos((p) => p + 1);
        setTimerKey((k) => k + 1);
      }
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [timerKey]);

  // Re-arm autoplay when the tab becomes visible again.
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) resetTimer();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [resetTimer]);

  // — swipe: advance on release past a threshold ————————————————————
  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { startX: event.clientX, active: true };
  };
  const endDrag = (event: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
  };

  const trackStyle: CSSProperties = {
    width: `${(count + 2) * 100}%`,
    transform: `translate3d(${(-pos * slideWidthPct).toFixed(4)}%, 0, 0)`,
    transition: animate ? undefined : 'none',
  };

  // Extended strip: last clone, real slides, first clone.
  const strip = [heroSlides[count - 1], ...heroSlides, heroSlides[0]];

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Bundsgård">
      <div
        className="hero-carousel__viewport"
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="hero-carousel__track" style={trackStyle}>
          {strip.map((slide, i) => {
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
