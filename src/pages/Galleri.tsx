import { useState } from 'react';

import ImageSlot from '../components/ImageSlot';
import Lightbox from '../components/Lightbox';
import { gallery } from '../content/photos';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
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

export default function Galleri() {
  useDocumentTitle(routes.galleri.title);

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
        <div className="galleri__mosaic">
          {gallery.map((item, index) => (
            <button
              key={item.placeholder}
              type="button"
              className={`gtile gtile--${TILE_PATTERN[index % TILE_PATTERN.length]}`}
              aria-haspopup="dialog"
              onClick={() => setOpenAt(index)}
            >
              {/* ratio="auto" hands the frame's shape to the grid: the tile's
                  cell span decides it, and the photo covers whatever it gets. */}
              <ImageSlot photo={item} ratio="auto" eager={index < 4} />
              <span className="gtile__caption">{item.caption}</span>
            </button>
          ))}
        </div>
      </section>

      {openAt !== null && (
        <Lightbox items={gallery} startIndex={openAt} onClose={() => setOpenAt(null)} />
      )}
    </div>
  );
}
