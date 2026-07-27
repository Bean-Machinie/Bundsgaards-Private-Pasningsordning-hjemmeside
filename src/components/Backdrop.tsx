import './Backdrop.css';

/** Which band of the picture a section shows — see Backdrop.css. */
export type BackdropVariant = 'welcome' | 'values';

/**
 * The paper the front page is printed on: handprints, pine cones, needles,
 * twigs and soil, composed as one spread with its groups gathered down the left
 * and right and the middle left clear for the reading.
 *
 * The source is one photograph-derived mask (flat white with the subject in its
 * alpha, the form every piece in assets/images/backdrop takes), cut in two down
 * its empty middle by scripts/make-backdrop-pieces.mjs. Each half is hung on the
 * edge it was composed for and sized against the section's height, so it spills
 * above and below — the page shows whatever falls on cream and the rest carries
 * on underneath the hero photograph and the day band. The colour lives in CSS,
 * a step darker than the cream ground.
 *
 * The layer paints behind everything on the page (z-index: -1, in the page's own
 * stacking context) and takes no pointer events, so it passes under headings and
 * photographs without ever being in the way. Decorative in the strict sense:
 * aria-hidden, no text, nothing lost with images off.
 */
export default function Backdrop({ variant }: { variant: BackdropVariant }) {
  return (
    <div className={`backdrop backdrop--${variant}`} aria-hidden="true">
      <span className="backdrop__side backdrop__side--left" />
      <span className="backdrop__side backdrop__side--right" />
    </div>
  );
}
