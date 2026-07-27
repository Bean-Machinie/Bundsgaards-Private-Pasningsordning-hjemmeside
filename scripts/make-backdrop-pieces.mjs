/**
 * Builds every piece of the front page's background trail
 * (components/BackdropTrail.tsx) from the photographs in src/assets/images/,
 * and writes the manifest the component reads.
 *
 *   hand-1.png, hand-2.png  →  backdrop/hand-1.png, hand-2.png
 *   stick.png               →  backdrop/stick.png
 *   needles.png             →  backdrop/needle-01.png … needle-12.png
 *   dirt.png                →  backdrop/dirt.png
 *   gran.png, gran-2.png    →  backdrop/gran-1.png, gran-2.png
 *   backdrop.png            →  backdrop/backdrop-left.png, backdrop-right.png
 *                           →  src/assets/backdropPieces.ts
 *
 * ── Why masks, not pictures ────────────────────────────────────────────────
 * Every output is a flat white image whose *alpha* carries the subject. That
 * makes each file a mask: the component supplies the colour from a token, so
 * nothing in the source photography can fight the palette — and, critically,
 * no white survives. A recolouring filter would keep the white highlights in
 * the paint and the pale wood, and white is the one tone that cannot sit on the
 * cream background without looking like a mistake.
 *
 * ── Where the alpha comes from ─────────────────────────────────────────────
 * Each source needs a different read of "how much subject is here":
 *
 *   hands    chroma — max(r,g,b) - min(r,g,b). Reads as "how much blue paint",
 *            so the thick body goes solid and every white highlight falls to
 *            nothing. Luminance would have done the exact opposite.
 *   stick    its own alpha channel, which the photograph already carries, with
 *            luminance mixed in lightly so the wood keeps some grain instead of
 *            going flat.
 *   needles  chroma again: the needles are green and brown, and the soft drop
 *            shadows around them are neutral grey, so chroma keeps the needles
 *            and drops the shadows for free.
 *   dirt     darkness — 1 - luminance — because chroma would be wrong here.
 *            Soil is scattered with grey pebbles, and grey is exactly what
 *            chroma throws away; on a pure white sheet, "how far from white" is
 *            what actually means "how much dirt". The faint shadows it also
 *            keeps land at around a tenth of full density, which on this
 *            subject reads as dust rather than as a halo.
 *   cones    darkness too. A cone is mostly shadow: the deep gaps between its
 *            scales are nearly black, which is very little chroma, so reading
 *            chroma would hollow out exactly the structure that makes it
 *            recognisable. Darkness keeps the gaps solid and lets the lit tops
 *            of the scales fall away, which is what a print of one would do.
 *
 * ── Splitting the needles ──────────────────────────────────────────────────
 * The needle photograph is one sheet of scattered needles, which is far too
 * regular to use whole. It is segmented into connected blobs (8-connectivity
 * flood fill) and a spread of them is cut out individually, so the page can
 * sprinkle single needles, pairs and little fans around the other pieces
 * instead of repeating one arrangement. Blobs are chosen by shape rather than
 * by index — see PICKS — so the selection survives re-tuning the threshold.
 *
 * Run with: node scripts/make-backdrop-pieces.mjs
 * Output is committed; re-run only when a source or a number here changes.
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';

import sharp from 'sharp';

const IMAGES = 'src/assets/images';
const OUT_DIR = `${IMAGES}/backdrop`;
const MANIFEST = 'src/assets/backdropPieces.ts';

/** No scattered piece is ever drawn wider than ~340 CSS px; this covers 2×. */
const MAX_WIDTH = 560;
/** Each half of the spread is drawn far larger than a scattered piece. */
const SPREAD_MAX_WIDTH = 700;
/** Chroma at or above this counts as full density (hands and needles). */
const FULL_CHROMA = { hand: 0.7, needle: 0.32 };
/** Darkness (1 - luminance) at or above this counts as full density (dirt). */
const FULL_DARKNESS = 0.62;
/**
 * Below this darkness there is nothing there. The soil sheet's paper is 254,
 * not 255, which is enough to survive at about 1% density — invisible in the
 * source, but on cream it prints the whole sheet as a faint rectangle around
 * the scatter. Anything paler than this is paper, not subject.
 */
const DARKNESS_FLOOR = 0.02;
/** < 1 lifts the faint end, so pieces fade out at their edges. */
const GAMMA = 0.9;
/** Below this chroma a needle pixel is background or shadow, not needle. */
const NEEDLE_FLOOR = 0.07;
/** Ignore specks: a single needle is ~1500 px of ink. */
const NEEDLE_MIN_AREA = 700;

async function readRaw(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Flat white, `alpha` as the mask, written out at a sane size. */
async function writeMask(alpha, width, height, destination, maxWidth = MAX_WIDTH) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = alpha[i];
  }
  await sharp(out, { raw: { width, height, channels: 4 } })
    .resize({ width: Math.min(maxWidth, width) })
    .png({ compressionLevel: 9, effort: 10, palette: true, quality: 80 })
    .toFile(destination);

  const { size } = await stat(destination);
  return { width, height, kb: size / 1024 };
}

const chromaOf = (data, at) => {
  const r = data[at];
  const g = data[at + 1];
  const b = data[at + 2];
  return (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
};

const lumaOf = (data, at) =>
  (0.299 * data[at] + 0.587 * data[at + 1] + 0.114 * data[at + 2]) / 255;

async function buildHand(name) {
  const { data, width, height } = await readRaw(`${IMAGES}/${name}.png`);
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    const density = Math.min(1, chromaOf(data, i * 4) / FULL_CHROMA.hand) ** GAMMA;
    alpha[i] = Math.round((data[i * 4 + 3] / 255) * density * 255);
  }
  return writeMask(alpha, width, height, `${OUT_DIR}/${name}.png`);
}

/**
 * Crops away empty margin. A piece is positioned by its centre on the page, so
 * its box has to *be* the subject — the stick in particular is a thin thing in
 * a mostly empty frame.
 */
function trim(alpha, width, height, threshold = 8) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alpha[y * width + x] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { alpha, width, height };

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      out[y * w + x] = alpha[(y + minY) * width + (x + minX)];
    }
  }
  return { alpha: out, width: w, height: h };
}

/**
 * The composed spread, which arrives already in mask form — flat white with the
 * arrangement in its alpha. Nothing to extract, so this pass does two other
 * jobs.
 *
 * It halves it. Drawn whole, the spread is a 16:9 picture standing in a section
 * a fifth of that tall, so most of it is overflow that never gets seen. Cut in
 * two, each half is nearly square, can be sized against the section's own
 * height instead of the viewport's width, and hugs the edge it belongs to — so
 * far more of the arrangement actually lands on the page. The cut goes down the
 * emptiest column near the middle (the composition leaves its centre clear for
 * the text, so there is a seam of pure transparency to cut along), and each
 * half is then trimmed to its own content.
 *
 * And it gets the weight down: these two ship to every visitor, and
 * palette-quantising a soft single-colour mask is invisible and roughly thirds
 * the file.
 */
async function buildSpread(name) {
  const { data, width, height } = await readRaw(`${IMAGES}/${name}.png`);

  const columns = new Float64Array(width);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) columns[x] += data[(y * width + x) * 4 + 3];
  }

  // The emptiest column in the middle third, then the centre of the empty run
  // it belongs to — cutting at the middle of the gap rather than at its first
  // column keeps both halves clear of the other's pieces.
  const from = Math.floor(width * 0.38);
  const to = Math.ceil(width * 0.62);
  let seam = from;
  for (let x = from; x < to; x += 1) if (columns[x] < columns[seam]) seam = x;
  let lo = seam;
  let hi = seam;
  while (lo > from && columns[lo - 1] <= columns[seam]) lo -= 1;
  while (hi < to - 1 && columns[hi + 1] <= columns[seam]) hi += 1;
  const cut = Math.round((lo + hi) / 2);

  const halves = [];
  for (const [side, x0, x1] of [
    ['left', 0, cut],
    ['right', cut, width],
  ]) {
    const w = x1 - x0;
    const alpha = new Uint8Array(w * height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < w; x += 1) {
        alpha[y * w + x] = data[(y * width + (x + x0)) * 4 + 3];
      }
    }
    const trimmed = trim(alpha, w, height);
    const written = await writeMask(
      trimmed.alpha,
      trimmed.width,
      trimmed.height,
      `${OUT_DIR}/${name}-${side}.png`,
      SPREAD_MAX_WIDTH,
    );
    halves.push({ name: `${name}-${side}`, ...written });
  }

  console.log(`  spread cut at column ${cut} of ${width} (empty run ${lo}–${hi})`);
  return halves;
}

/** Anything photographed on a white sheet: darkness is the density. */
async function buildDark(source, name = source) {
  const { data, width, height } = await readRaw(`${IMAGES}/${source}.png`);
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    const darkness = Math.max(0, 1 - lumaOf(data, i * 4) - DARKNESS_FLOOR);
    const density = Math.min(1, darkness / FULL_DARKNESS) ** GAMMA;
    alpha[i] = Math.round((data[i * 4 + 3] / 255) * density * 255);
  }
  const trimmed = trim(alpha, width, height);
  return writeMask(trimmed.alpha, trimmed.width, trimmed.height, `${OUT_DIR}/${name}.png`);
}

async function buildStick() {
  const { data, width, height } = await readRaw(`${IMAGES}/stick.png`);
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    // Mostly the silhouette the photograph's own alpha already gives, with the
    // darker grain pressing a little harder so the wood doesn't go flat.
    const density = 0.62 + 0.38 * (1 - lumaOf(data, i * 4));
    alpha[i] = Math.round((data[i * 4 + 3] / 255) * density * 255);
  }
  const trimmed = trim(alpha, width, height, 24);
  return writeMask(trimmed.alpha, trimmed.width, trimmed.height, `${OUT_DIR}/stick.png`);
}

/** Every 8-connected blob of needle in the sheet, largest first. */
function findBlobs(data, width, height) {
  const on = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    on[i] = chromaOf(data, i * 4) > NEEDLE_FLOOR ? 1 : 0;
  }

  const seen = new Uint8Array(width * height);
  const blobs = [];
  const stack = [];

  for (let start = 0; start < width * height; start += 1) {
    if (!on[start] || seen[start]) continue;
    let area = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    const pixels = [];

    seen[start] = 1;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      const x = p % width;
      const y = (p / width) | 0;
      area += 1;
      pixels.push(p);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const q = ny * width + nx;
          if (on[q] && !seen[q]) {
            seen[q] = 1;
            stack.push(q);
          }
        }
      }
    }

    if (area < NEEDLE_MIN_AREA) continue;
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    blobs.push({ area, minX, minY, w, h, pixels, fill: area / (w * h) });
  }

  return blobs.sort((a, b) => b.area - a.area);
}

/**
 * Twelve blobs, chosen by shape so the page has real variety to sprinkle:
 * the biggest tangles, some loose sprigs, and some lone needles. Selecting on
 * geometry rather than on position means re-running after a threshold change
 * still yields the same *kinds* of piece.
 */
const PICKS = [
  { label: 'tangle', take: 4, match: () => true },
  { label: 'sprig', take: 4, match: (b) => b.area > 1400 && b.area < 3200 && b.fill < 0.3 },
  { label: 'needle', take: 4, match: (b) => b.fill > 0.34 && b.area < 2600 },
];

async function buildNeedles() {
  const { data, width, height } = await readRaw(`${IMAGES}/needles.png`);
  const blobs = findBlobs(data, width, height);
  console.log(`needles — ${blobs.length} blobs over ${NEEDLE_MIN_AREA}px`);

  const chosen = [];
  const used = new Set();
  for (const pick of PICKS) {
    let taken = 0;
    for (const blob of blobs) {
      if (taken >= pick.take) break;
      if (used.has(blob)) continue;
      if (!pick.match(blob)) continue;
      used.add(blob);
      chosen.push(blob);
      taken += 1;
    }
  }

  const written = [];
  for (const [index, blob] of chosen.entries()) {
    const alpha = new Uint8Array(blob.w * blob.h);
    for (const p of blob.pixels) {
      const x = (p % width) - blob.minX;
      const y = ((p / width) | 0) - blob.minY;
      const density = Math.min(1, chromaOf(data, p * 4) / FULL_CHROMA.needle) ** GAMMA;
      alpha[y * blob.w + x] = Math.round(density * 255);
    }
    const name = `needle-${String(index + 1).padStart(2, '0')}`;
    const result = await writeMask(alpha, blob.w, blob.h, `${OUT_DIR}/${name}.png`);
    written.push({ name, ...result });
  }
  return written;
}

/** The component needs each piece's URL and proportions; a masked box has no
 *  picture to take its height from, so the ratio has to be data. */
async function writeManifest(pieces) {
  const lines = [
    '/* Generated by scripts/make-backdrop-pieces.mjs — do not edit by hand.',
    ' *',
    ' * Every piece of the front page background trail: a white PNG whose alpha',
    ' * is the subject, plus the proportions the component needs to size a',
    ' * masked box (which has no intrinsic dimensions of its own). */',
    '',
    ...pieces.map(
      (p, i) => `import piece${i} from './images/backdrop/${p.name}.png';`,
    ),
    '',
    'export interface BackdropPiece {',
    '  /** Fingerprinted URL of the mask. */',
    '  src: string;',
    '  /** width / height, for the CSS aspect-ratio. */',
    '  ratio: number;',
    '}',
    '',
    'export const backdropPieces = {',
    ...pieces.map(
      (p, i) =>
        `  '${p.name}': { src: piece${i}, ratio: ${(p.width / p.height).toFixed(4)} },`,
    ),
    '} satisfies Record<string, BackdropPiece>;',
    '',
    'export type PieceName = keyof typeof backdropPieces;',
    '',
  ];
  await writeFile(MANIFEST, lines.join('\n'), 'utf8');
  console.log(`${MANIFEST} — ${pieces.length} pieces`);
}

await mkdir(OUT_DIR, { recursive: true });

// The two halves of the spread are consumed by Backdrop.css through plain
// url()s, not by the manifest below, so they are built but not listed.
for (const half of await buildSpread('backdrop')) {
  console.log(
    `  ${half.name} — ${half.width}x${half.height}, ${half.kb.toFixed(0)} kB` +
      `, aspect-ratio ${(half.width / half.height).toFixed(4)}`,
  );
}

const pieces = [];
for (const hand of ['hand-1', 'hand-2']) {
  pieces.push({ name: hand, ...(await buildHand(hand)) });
}
pieces.push({ name: 'stick', ...(await buildStick()) });
// [source, output] — the cones are numbered as a pair on the way out.
for (const [source, name] of [
  ['dirt', 'dirt'],
  ['gran', 'gran-1'],
  ['gran-2', 'gran-2'],
]) {
  pieces.push({ name, ...(await buildDark(source, name)) });
}
pieces.push(...(await buildNeedles()));

for (const p of pieces) {
  console.log(`  ${p.name} — ${p.width}x${p.height}, ${p.kb.toFixed(0)} kB`);
}

await writeManifest(pieces);
