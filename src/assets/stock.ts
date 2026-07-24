/**
 * Local stock photography, imported so Vite fingerprints and optimises each
 * file. Friendly names describe the picture; the filenames keep their original
 * Pexels attribution. Everything the site shows comes from here — no external
 * image hosts.
 *
 * The photos live in `src/assets/images/stock/`. Swap a caretaker's real
 * photography in by replacing a file (keep the import name) or by pointing the
 * import at a new file.
 */

import pinecones from './images/stock/pexels-2151090197-31497951.jpg';
import meadowWalk from './images/stock/pexels-blaj-gabriel-80193688-10933642.jpg';
import explorers from './images/stock/pexels-cottonbro-9292786.jpg';
import wildflowers from './images/stock/pexels-itfeelslikefilm-2858263.jpg';
import autumnGirl from './images/stock/pexels-jennifer-moore-352885-974353.jpg';
import twoBoys from './images/stock/pexels-katia-damyan-205356439-19092054.jpg';
import leaf from './images/stock/pexels-maria-verkhoturtseva-21177529-10401974.jpg';
import pointingSky from './images/stock/pexels-michael-obstoj-1772571864-33515757.jpg';
import tallGrass from './images/stock/pexels-polina-smelova-80605762-10215423.jpg';
import handsBw from './images/stock/pexels-raffoux-12235410.jpg';
import sticks from './images/stock/pexels-stephentcandrews-9305063.jpg';
import goldenRun from './images/stock/pexels-tam-d-ng-182134290-11217096.jpg';

export const stock = {
  /** Toddler in a white dress holding pinecones, bright dappled light. */
  pinecones,
  /** Two children hand in hand crossing a mountain meadow. */
  meadowWalk,
  /** Two children exploring with binoculars and a map by a tree. */
  explorers,
  /** Girl holding wildflowers in a dim forest — moody, calm. */
  wildflowers,
  /** Girl in pink looking down, warm autumn leaves behind. */
  autumnGirl,
  /** Two toddler boys in an autumn wood, one laughing (portrait). */
  twoBoys,
  /** Child smelling a leaf, soft green bokeh (close-up). */
  leaf,
  /** Child from behind pointing up at the sky in a garden (portrait). */
  pointingSky,
  /** Child in a yellow raincoat walking through tall grass toward a wood. */
  tallGrass,
  /** Black-and-white: two small children holding hands in a park (portrait). */
  handsBw,
  /** Two children crouching to examine sticks on a forest path. */
  sticks,
  /** Two children running in a sunlit wood, golden-hour flare. */
  goldenRun,
} as const;

export type StockKey = keyof typeof stock;
