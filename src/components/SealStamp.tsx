// Generated from stamp.png with sharp (resize 600 + luminance-preserving
// tint to the theme's terracotta #8f4018 / --color-accent), so the seal
// wears the same colour as the Kontakt button and the script headings.
import { useLayoutEffect, useRef, useState } from 'react';

import stamp from '../assets/images/stamp-terracotta.png';

import './SealStamp.css';

/* The text must stay strictly on the seal's flat inner disc, never on the
   flowing rim. Measured off the 600px PNG the flat disc is ~58% of the
   image wide; 0.50 leaves a visible margin of calm wax inside the engraved
   ring. */
const DISC_USABLE = 0.5;
/* Must equal .seal-stamp__line's font-size — the fit maths converts the
   measured base-size layout into a scale factor. */
const LINE_BASE_PX = 40;
/* Very short imprints ("HEJ") would otherwise balloon to fill the disc;
   cap the main line at this fraction of the seal's width. */
const MAX_LINE_FRACTION = 0.13;

type SealStampProps = {
  /** Main imprint, one array entry per line. Any length — the whole block
   *  is auto-scaled so every line stays inside the seal's inner disc. */
  lines?: string[];
  /** Smaller line under the main imprint (a date, typically). */
  subline?: string;
};

/**
 * The wax seal, carrying a message pressed into the wax.
 *
 * Drop it between two sections and it takes no space of its own: the
 * component is a zero-height anchor, and the seal centres itself on that
 * boundary line — half over the section above, half over the one below,
 * sitting three quarters of the way across and leaning slightly clockwise.
 * It paints above everything on the page except the sticky header.
 *
 * The imprint self-fits: each line is laid out at a fixed base size,
 * measured, and the block is scaled to the largest factor where every
 * line's corners still fall inside the disc circle — lines further from
 * the middle get less width, exactly like a real engraved seal. Refits on
 * seal resize and on webfont load (both change the measured boxes).
 *
 * The image is decoration, but the imprinted text is real information
 * (availability), so only the img is aria-hidden.
 */
export default function SealStamp({
  lines = ['Ledige', 'pladser'],
  subline,
}: SealStampProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const text = textRef.current;
    if (!body || !text) return;

    const fit = () => {
      const radius = (body.clientWidth * DISC_USABLE) / 2;
      if (radius === 0) return;
      /* offsetWidth/offsetTop ignore ancestor transforms, so the rotation
         and the previously applied scale never feed back into the fit. */
      const centreY = text.offsetHeight / 2;
      let next = (MAX_LINE_FRACTION * body.clientWidth) / LINE_BASE_PX;
      for (const child of text.children) {
        const line = child as HTMLElement;
        const halfWidth = line.offsetWidth / 2;
        /* The line edge (top or bottom) furthest from the block centre is
           where its corner would first cross the circle. */
        const farEdge = Math.max(
          Math.abs(line.offsetTop - centreY),
          Math.abs(line.offsetTop + line.offsetHeight - centreY),
        );
        next = Math.min(next, radius / Math.hypot(halfWidth, farEdge));
      }
      setScale(next);
    };

    fit();
    const observer = new ResizeObserver(fit);
    /* body: viewport steps resize the seal. text: the Fraunces webfont
       landing changes the measured line boxes without resizing the seal.
       The scale itself is a transform, which never triggers the observer,
       so this cannot loop. */
    observer.observe(body);
    observer.observe(text);
    return () => observer.disconnect();
  }, [lines.join('\n'), subline]);

  return (
    <div className="seal-stamp">
      <div className="seal-stamp__body" ref={bodyRef}>
        <img
          className="seal-stamp__img"
          src={stamp}
          alt=""
          aria-hidden="true"
          draggable={false}
          onContextMenu={(event) => event.preventDefault()}
        />
        <p
          className="seal-stamp__text"
          ref={textRef}
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          {lines.map((line) => (
            <span key={line} className="seal-stamp__line">
              {line}
            </span>
          ))}
          {subline && <span className="seal-stamp__subline">{subline}</span>}
        </p>
      </div>
    </div>
  );
}
