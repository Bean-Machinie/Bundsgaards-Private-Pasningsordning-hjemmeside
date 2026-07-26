import stamp from '../assets/images/stamp.png';

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
