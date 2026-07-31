import { useState } from 'react';

import ImageSlot from '../components/ImageSlot';
import Lightbox from '../components/Lightbox';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSiteData } from '../lib/sheet/provider';
import { routes } from '../routes';

import './Galleri.css';

/**
 * The mosaic is cut from two blocks, each seven tiles filling a 4 × 3 grid of
 * cells exactly. The second is the first mirrored, so the big shapes cross the
 * page instead of stacking down one side — the structure repeats, the picture
 * doesn't:
 *
 *     ┌───────┬───┬───┐   ┌───┬───┬───────┐
 *     │       │   │ s │   │ s │   │       │
 *     │   F   │ T ├───┤   ├───┤ T │   F   │
 *     │       │   │ s │   │ s │   │       │
 *     ├───────┼───┼───┤   ├───┼───┼───────┤
 *     │   W   │ s │ s │   │ s │ s │   W   │
 *     └───────┴───┴───┘   └───┴───┴───────┘
 *          block A              block B
 *
 * Both blocks hold the same tiles — one big square, one upright, one wide, four
 * small — in a different order, which is what flips them: tiles are placed in
 * sequence, so the order below *is* the arrangement.
 *
 * Nothing spans more than two of the four columns, so no photo ever runs the
 * full width of the page. Each row keeps at least one small tile, which is what
 * gives the row its height (see Galleri.css). The shapes are matched to the
 * photos by the order of `gallery` in content/photos.ts — see the note there
 * before reordering.
 */
const TILE_PATTERN = [
  // Block A — the big square opens on the left.
  'feature',
  'tall',
  'small',
  'small',
  'wide',
  'small',
  'small',
  // Block B — the same seven shapes, flipped to the right.
  'small',
  'tall',
  'feature',
  'small',
  'small',
  'small',
  'wide',
] as const;

type Shape = (typeof TILE_PATTERN)[number];

/**
 * A shape for every photo.
 *
 * The photo count used to be ours to keep at a multiple of seven. It isn't any
 * more — it is however many links are in the sheet that morning — and a block
 * cut off partway through leaves the big shapes without the small tiles that
 * give their rows a height, which is the one rule this layout can't break.
 *
 * So only whole blocks take the pattern, and whatever is left over is laid as
 * plain squares. A tail of squares is a shape the mosaic already uses and can
 * end on at any count; a half-drawn block is a hole in the page.
 */
function tileShapes(count: number): Shape[] {
  const period = TILE_PATTERN.length;
  const whole = count - (count % period);
  return Array.from({ length: count }, (_, index) =>
    index < whole ? TILE_PATTERN[index % period] : 'small',
  );
}

/**
 * How wide each shape is laid out, so the browser can pick a rendition.
 *
 * Only meaningful for Drive-hosted photos, which come with a `srcSet` of four
 * widths — a phone then fetches the 480px copy of a tile it will draw at 190,
 * instead of whatever the caretaker uploaded from her camera roll. The wide
 * shapes are two of four columns above 860px and one of two below it, which is
 * half the viewport either way.
 */
const TILE_SIZES: Record<Shape, string> = {
  small: '(max-width: 860px) 50vw, 25vw',
  tall: '(max-width: 860px) 50vw, 25vw',
  wide: '50vw',
  feature: '50vw',
};

export default function Galleri() {
  useDocumentTitle(routes.galleri.title);

  const { gallery } = useSiteData();
  const shapes = tileShapes(gallery.length);

  /** Index of the photo the viewer is open on, or null while it is closed. */
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <div className="enter">
      <section className="shell section--loose galleri__head">
        <h1 className="title-page">
          Billeder fra <em className="title-em">en uge</em>
        </h1>
      </section>

      <section className="shell section--loose galleri__body">
        {gallery.length === 0 ? (
          <p className="galleri__empty">
            Der er ingen billeder her lige nu. Kig forbi igen — der kommer nye
            løbende.
          </p>
        ) : (
          <div className="galleri__mosaic">
            {gallery.map((item, index) => (
              <button
                key={`${index}-${item.src ?? item.placeholder}`}
                type="button"
                className={`gtile gtile--${shapes[index]}`}
                aria-haspopup="dialog"
                onClick={() => setOpenAt(index)}
              >
                {/* ratio="auto" hands the frame's shape to the grid: the tile's
                    cell span decides it, and the photo covers whatever it gets.
                    The first four are above the fold on every viewport, so they
                    are fetched at once; the rest wait for the browser to decide
                    they are close enough to matter. */}
                <ImageSlot
                  photo={item}
                  ratio="auto"
                  eager={index < 4}
                  sizes={TILE_SIZES[shapes[index]]}
                />
                <span className="gtile__caption">{item.caption}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {openAt !== null && (
        <Lightbox items={gallery} startIndex={openAt} onClose={() => setOpenAt(null)} />
      )}
    </div>
  );
}
