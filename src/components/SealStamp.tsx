// Generated from stamp.png with sharp (resize 600 + luminance-preserving
// tint to the theme's terracotta #8f4018 / --color-accent), so the seal
// wears the same colour as the Kontakt button and the script headings.
import stamp from '../assets/images/stamp-terracotta.png';

import './SealStamp.css';

/**
 * The wax seal — a purely decorative overlay awaiting its real workflow.
 *
 * Drop it between two sections and it takes no space of its own: the
 * component is a zero-height anchor, and the seal centres itself on that
 * boundary line — half over the section above, half over the one below,
 * sitting three quarters of the way across and leaning slightly clockwise.
 * It paints above everything on the page except the sticky header.
 */
export default function SealStamp() {
  return (
    <div className="seal-stamp" aria-hidden="true">
      <img
        className="seal-stamp__img"
        src={stamp}
        alt=""
        draggable={false}
        onContextMenu={(event) => event.preventDefault()}
      />
    </div>
  );
}
