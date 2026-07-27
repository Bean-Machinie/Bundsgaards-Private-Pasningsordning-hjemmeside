import './HandTrail.css';

/** One print in a trail. */
interface HandPrint {
  /** Which of the two prints — 1 is the splayed hand, 2 the rounder one. */
  hand: 1 | 2;
  /** Flipped left-to-right, so the same two files read as more than two hands. */
  mirrored?: boolean;
  /** Centre of the print, as a percentage of the trail's box. */
  x: number;
  y: number;
  /** Multiplier on the trail's base size. */
  scale: number;
  /** Tilt, in degrees. */
  rotate: number;
  /** How firmly it was pressed: 0–1, on top of the layer's own softening. */
  strength: number;
}

/**
 * The two runs, composed rather than generated.
 *
 * A random scatter reads as noise and a formula reads as wallpaper; these are
 * placed by hand along one swinging path — into the top-left corner, dipping
 * down under the welcome text, rising towards the right, then picking the line
 * back up further down the page.
 *
 * The tilts are the thing that stops it reading as one shape stamped six times.
 * They don't jitter around upright — each run turns steadily through nearly two
 * hundred degrees, so a print sits sideways where the path runs flat and comes
 * over on its head where the path climbs, as if the hand rolled along with the
 * swing. The two runs turn in opposite directions, which keeps the lower one
 * from echoing the upper. Sizes, pressure and mirroring vary alongside, and no
 * two neighbours share a value.
 *
 * Coordinates are percentages, so the path holds its shape at any width, and
 * the ones at 0 and 100 are past the edge on purpose: the layer is viewport-
 * wide and clips, so those prints crop into the page rather than sitting inside
 * a margin. A couple sit close together in pairs, the way two hands land when a
 * child presses them down at once.
 */
const TRAILS = {
  /** Under the hero: the trail arrives, dips, and swings back up to the right. */
  welcome: [
    { hand: 1, x: 4, y: 34, scale: 1.3, rotate: -48, strength: 0.78 },
    { hand: 2, x: 16, y: 88, scale: 1.0, rotate: -12, strength: 0.62, mirrored: true },
    { hand: 1, x: 33, y: 20, scale: 0.85, rotate: 25, strength: 0.5 },
    { hand: 2, x: 52, y: 99, scale: 0.72, rotate: 67, strength: 0.46 },
    { hand: 1, x: 71, y: 84, scale: 1.05, rotate: 101, strength: 0.58, mirrored: true },
    { hand: 2, x: 92, y: 58, scale: 1.2, rotate: 148, strength: 0.66 },
  ],
  /** Further down, past the day band: the same line, carried on across. */
  values: [
    { hand: 2, x: 2, y: 22, scale: 1.15, rotate: 130, strength: 0.6 },
    { hand: 1, x: 14, y: 70, scale: 1.0, rotate: 88, strength: 0.66, mirrored: true },
    { hand: 2, x: 33, y: 99, scale: 0.8, rotate: 42, strength: 0.5 },
    { hand: 1, x: 46, y: 90, scale: 0.68, rotate: -8, strength: 0.44 },
    { hand: 2, x: 75, y: 87, scale: 1.1, rotate: -52, strength: 0.6, mirrored: true },
    { hand: 1, x: 97, y: 44, scale: 1.25, rotate: -96, strength: 0.7 },
  ],
} satisfies Record<string, HandPrint[]>;

export type TrailName = keyof typeof TRAILS;

/**
 * Handprints in the background of the front page's cream sections.
 *
 * The prints are the real thing — two photographed paint handprints, stripped
 * of their colour by scripts/make-hand-prints.mjs and kept only as masks. The
 * tone therefore lives here, in CSS, one step darker than the cream ground;
 * nothing in the images themselves can fight the palette.
 *
 * The layer sits behind everything in its section (z-index: -1 inside the
 * section's own stacking context) and takes no pointer events, so it can pass
 * under headings and photographs without ever being in the way. It is
 * decorative in the strict sense — aria-hidden, no text, no meaning lost with
 * images off.
 */
export default function HandTrail({ trail }: { trail: TrailName }) {
  return (
    <div className="hand-trail" aria-hidden="true">
      {TRAILS[trail].map((print, index) => (
        <span
          key={index}
          className={`hand-print hand-print--${print.hand}`}
          style={{
            left: `${print.x}%`,
            top: `${print.y}%`,
            width: `calc(var(--hand-size) * ${print.scale})`,
            opacity: print.strength,
            transform: `translate(-50%, -50%) rotate(${print.rotate}deg)${
              print.mirrored ? ' scaleX(-1)' : ''
            }`,
          }}
        />
      ))}
    </div>
  );
}
