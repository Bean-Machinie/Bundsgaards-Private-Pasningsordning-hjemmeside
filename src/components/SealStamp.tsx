// Generated from stamp.png with sharp (resize 600 + luminance-preserving
// tint to the theme's terracotta #8f4018 / --color-accent), so the seal
// wears the same colour as the Kontakt button and the script headings.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import stamp from '../assets/images/stamp-terracotta.png';
import type { StyleWithVars } from '../lib/css';

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
  /** Smaller text under the main imprint (a date, typically). An array
   *  splits it over several lines — narrower lines let the circle-fit
   *  scale the whole imprint up. */
  subline?: string | string[];
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
  const sublines = subline == null || Array.isArray(subline) ? subline : [subline];
  const bodyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  /* The seal is held back until it is finished, and shown in one move. Both
     halves of it settle late in ways that would otherwise be watched happening:

       · the wax is a 205 KB PNG, and until it decodes the frame around it has
         no height to speak of;
       · the imprint is measured to fit the disc, and it measures differently
         in Fraunces than in the Georgia that stands in while Fraunces loads —
         so the fit would visibly re-run under the reader.

     Waiting for both means the geometry is final before anything is painted.
     On a repeat visit the PNG is already in cache and reports complete before
     the first paint, so this costs a frame, not a wait. */
  const [waxReady, setWaxReady] = useState(false);
  const [typeReady, setTypeReady] = useState(false);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setWaxReady(true);
  }, []);

  useEffect(() => {
    // Resolves once no font loads are outstanding — including immediately, if
    // none ever were. Older engines without the API simply don't wait.
    if (!document.fonts) {
      setTypeReady(true);
      return;
    }
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) setTypeReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    /* body: viewport steps resize the seal. text: a late webfont changes the
       measured line boxes without resizing the seal. The scale itself is a
       transform, which never triggers the observer, so this cannot loop. */
    observer.observe(body);
    observer.observe(text);
    return () => observer.disconnect();
    /* typeReady is a dependency, which is what stops the imprint being seen
       resizing itself.

       The fit is a measurement of rendered text, so it only answers for the
       face the text is rendered in — and Fraunces and the Georgia standing in
       for it while it loads have different metrics, so they fit at different
       scales. Measuring once at mount therefore sizes the imprint for the
       wrong face, and the observer above corrects it when Fraunces lands: a
       correction that happens *after* the seal is on screen, which is the
       resettling you can see.

       Re-running here instead means the final measurement happens in a layout
       effect of the same commit that reveals the seal — before the browser
       paints — so the first frame anyone sees is already the right size. The
       observer stays as the safety net for everything after that. */
  }, [lines.join('\n'), sublines?.join('\n'), typeReady]);

  return (
    <div className="seal-stamp">
      <div
        className={
          waxReady && typeReady ? 'seal-stamp__body is-pressed' : 'seal-stamp__body'
        }
        ref={bodyRef}
      >
        <img
          ref={imgRef}
          className="seal-stamp__img"
          src={stamp}
          alt=""
          aria-hidden="true"
          /* The PNG's own dimensions, so the browser reserves a square box
             before a byte of it arrives. Without them `height: auto` resolves
             to zero until the image decodes — and since the seal is centred on
             the section boundary by translate(-50%, -50%), half of zero is
             zero: it would sit half a seal too low, then jump up the moment
             the wax landed. */
          width={600}
          height={600}
          draggable={false}
          /* No matching onError, deliberately: a seal that can't paint its wax
             is nothing but floating words, so a failed load leaves this false
             and the whole thing stays away. */
          onLoad={() => setWaxReady(true)}
          onContextMenu={(event) => event.preventDefault()}
        />
        <p
          className="seal-stamp__text"
          ref={textRef}
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            /* The carve is drawn in SealStamp.css at the base layout size and
               then scaled down with everything else, which takes its one-pixel
               lip to somewhere under half a pixel — too little to clear the
               glyph it hides behind, and rounded away on some rows and not
               others. Handing the stylesheet the inverse cancels the scale
               exactly, so the lip lands at the pixel it was drawn as whatever
               size the seal ends up. Floored well above zero: `scale` is only
               ever a fitted fraction, but nothing here should be one bad
               measurement away from dividing by nothing. */
            '--seal-carve': (1 / Math.max(scale, 0.05)).toFixed(4),
          } as StyleWithVars}
        >
          {lines.map((line) => (
            <span key={line} className="seal-stamp__line">
              {line}
            </span>
          ))}
          {sublines?.map((line) => (
            <span key={line} className="seal-stamp__subline">
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
