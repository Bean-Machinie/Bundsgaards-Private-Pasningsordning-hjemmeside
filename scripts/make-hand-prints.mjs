/**
 * Turns the two photographed handprints into alpha masks for the front page's
 * background trail (components/HandTrail.tsx).
 *
 *   src/assets/images/hand-1.png  →  hand-1-print.png
 *   src/assets/images/hand-2.png  →  hand-2-print.png
 *
 * The sources are blue poster paint on white: a strong blue body, white where
 * the paint went thin or the paper showed through, transparent outside the
 * print. Recolouring them in CSS is not enough on its own — a colour filter
 * keeps the white, and white is the one tone that cannot sit on the cream
 * background without looking like a mistake.
 *
 * So the colour is thrown away entirely and only the paint *density* is kept,
 * written into the alpha channel of a flat white image. That makes each file a
 * mask: HandTrail paints the colour with a background-colour token and uses the
 * mask for the shape, so the tone is a one-line change in CSS and no white can
 * ever survive into the page.
 *
 * Density comes from chroma — max(r,g,b) - min(r,g,b) — not from luminance.
 * Chroma reads "how much blue paint is here", so it takes the thick blue body
 * to ~1 and every white highlight to 0, which is exactly the white blending
 * itself out. Luminance would have done the opposite: it would have made the
 * white highlights the *most* solid part of the print.
 *
 * Measured on these two files, chroma runs from about 0.2 to 0.8 with the bulk
 * around 0.5, hence the divisor below — it lifts the mid-tones to a readable
 * density without clipping the thick areas into a flat slab. The gamma then
 * softens the faint end so the print fades out at its edges instead of ending
 * on a line.
 *
 * Run with: node scripts/make-hand-prints.mjs
 * The output is committed, so this only needs re-running if the sources change
 * or the numbers below want tuning.
 */

import { stat } from 'node:fs/promises';

import sharp from 'sharp';

/** Chroma at or above this counts as full paint density. */
const FULL_DENSITY_CHROMA = 0.7;
/** < 1 lifts the faint end, keeping the print's edges soft rather than sharp. */
const DENSITY_GAMMA = 0.9;
/**
 * The prints are never drawn wider than ~240 CSS px, so this covers a 2× screen
 * with room to spare. Full size would be half a megabyte of background
 * decoration each; the palette pass takes them down another 60%, and its
 * quantising is invisible in an image that is one colour with a soft edge.
 */
const MAX_WIDTH = 560;

const FILES = [
  ['src/assets/images/hand-1.png', 'src/assets/images/hand-1-print.png'],
  ['src/assets/images/hand-2.png', 'src/assets/images/hand-2-print.png'],
];

async function toMask(source, destination) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.width * info.height;
  const out = Buffer.alloc(pixels * 4);

  for (let i = 0; i < pixels; i += 1) {
    const at = i * 4;
    const r = data[at];
    const g = data[at + 1];
    const b = data[at + 2];
    const alpha = data[at + 3];

    const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    const density = Math.min(1, chroma / FULL_DENSITY_CHROMA) ** DENSITY_GAMMA;

    // Flat white body; the mask consumes the alpha channel only.
    out[at] = 255;
    out[at + 1] = 255;
    out[at + 2] = 255;
    out[at + 3] = Math.round((alpha / 255) * density * 255);
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ width: Math.min(MAX_WIDTH, info.width) })
    .png({ compressionLevel: 9, effort: 10, palette: true, quality: 80 })
    .toFile(destination);

  const { width, height } = await sharp(destination).metadata();
  const { size } = await stat(destination);
  console.log(`${destination} — ${width}x${height}, ${(size / 1024).toFixed(0)} kB`);
}

for (const [source, destination] of FILES) {
  await toMask(source, destination);
}
