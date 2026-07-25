import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import KeenSlider, { type KeenSliderInstance } from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

import { heroCtaPath, heroSlides } from '../content/heroSlides';
import { scrollToContact } from '../lib/scrollToContact';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

import './HeroCarousel.css';

const AUTOPLAY_MS = 14000;

/**
 * The front-page hero — a keen-slider instance with a hand-rolled autoplay
 * timer on top.
 *
 * keen-slider owns the motion: it measures the slides, applies the transforms,
 * and provides real touch/pointer drag and a seamless `loop`. React only
 * observes the position (via `slideChanged`) to drive the dots; it never sets
 * the position from state, which would create a feedback loop.
 *
 * We drive keen-slider through its vanilla factory inside an effect rather than
 * the React hook: under StrictMode the hook's ref-callback timing can leave a
 * dangling, un-laid-out instance, whereas an effect cleanly creates on mount
 * and destroys on unmount, re-laying-out on every remount.
 *
 * Structure that matters: the arrows and dots are siblings of the track, not
 * children of a slide — inside a slide they would translate away with it. The
 * image and overlay live inside each slide, so photo, scrim and text move as
 * one unit.
 *
 * Autoplay is a one-shot timeout that re-arms by bumping `timerKey` (an effect
 * dependency): every interaction — arrow, dot, drag — routes through
 * `resetTimer`, so interacting always buys a full interval rather than
 * inheriting a partial countdown. The auto-advance callback bumps the same key,
 * so manual reset and auto-advance share one path. It parks while the tab is
 * hidden and re-arms on return.
 */
export default function HeroCarousel() {
  const count = heroSlides.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);
  const sliderRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<KeenSliderInstance | null>(null);

  const resetTimer = useCallback(() => setTimerKey((k) => k + 1), []);

  useEffect(() => {
    const node = sliderRef.current;
    if (!node) return;

    const slider = new KeenSlider(node, {
      loop: true,
      initial: 0,
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      dragStarted() {
        resetTimer();
      },
    });
    instanceRef.current = slider;

    // Re-measure after the browser has laid the frame out — on the initial
    // mount keen-slider can measure the track before its final size is
    // resolved, which leaves it unable to advance.
    const raf = requestAnimationFrame(() => slider.update());

    return () => {
      cancelAnimationFrame(raf);
      slider.destroy();
      instanceRef.current = null;
      setLoaded(false);
    };
  }, [resetTimer]);

  // Autoplay — one-shot timeout that re-arms via timerKey. Gated on `loaded`
  // (the instance is null until keen-slider mounts) and parked when hidden or
  // reduced motion is preferred.
  useEffect(() => {
    if (!loaded) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;

    timerRef.current = window.setTimeout(() => {
      instanceRef.current?.next();
      setTimerKey((k) => k + 1);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loaded, timerKey, instanceRef]);

  // Re-arm autoplay when the tab becomes visible again.
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) setTimerKey((k) => k + 1);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const controlsReady = loaded && Boolean(instanceRef.current);

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Bundsgård">
      <div ref={sliderRef} className="keen-slider hero-carousel__track">
        {heroSlides.map((slide) => (
          <div className="keen-slider__slide hero-carousel__slide" key={slide.image}>
            <img
              className="hero-carousel__img"
              src={slide.image}
              alt={slide.alt}
              draggable={false}
            />
            <div className="hero-carousel__overlay" aria-hidden="true" />
            <div className="hero-carousel__content">
              <span className="hero-carousel__kicker">{slide.kicker}</span>
              <h1 className="hero-carousel__headline">
                {slide.headline}
                <span className="hero-carousel__highlight">{slide.highlight}</span>
              </h1>
              <p className="hero-carousel__subtext">{slide.subtext}</p>
              {slide.ctaTo === 'contact' ? (
                <a
                  href="#kontakt"
                  className="btn btn-primary btn--lg hero-carousel__cta"
                  onClick={scrollToContact}
                >
                  {slide.ctaLabel}
                  <ArrowRightIcon size={16} />
                </a>
              ) : (
                <Link
                  to={heroCtaPath(slide.ctaTo)}
                  className="btn btn-primary btn--lg hero-carousel__cta"
                >
                  {slide.ctaLabel}
                  <ArrowRightIcon size={16} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {controlsReady && (
        <>
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--prev"
            aria-label="Forrige billede"
            onClick={(event) => {
              event.stopPropagation();
              instanceRef.current?.prev();
              resetTimer();
            }}
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--next"
            aria-label="Næste billede"
            onClick={(event) => {
              event.stopPropagation();
              instanceRef.current?.next();
              resetTimer();
            }}
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
                onClick={() => {
                  instanceRef.current?.moveToIdx(i);
                  resetTimer();
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
