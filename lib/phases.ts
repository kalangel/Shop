/**
 * Maps the hero scroll progress (0..1) onto the cinematic camera path
 * and the exploded-view factor. Pure math — consumed inside the R3F
 * render loop, so it must stay allocation-light.
 */

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/** eased 0..1 ramp between two progress marks */
export const seg = (p: number, a: number, b: number) => smooth((p - a) / (b - a));

interface CameraKey {
  t: number;
  az: number; // azimuth around the garment
  r: number; // orbit radius
  y: number; // camera height
  ly: number; // look-at height
  fov: number;
}

/** hero orbit → approach → flight through the exploded layers → reveal orbit */
const KEYS: CameraKey[] = [
  { t: 0.0, az: 0.1, r: 7.4, y: 0.6, ly: 0.1, fov: 38 },
  { t: 0.15, az: 0.65, r: 5.4, y: 0.4, ly: 0.1, fov: 38 },
  { t: 0.34, az: 2.1, r: 3.5, y: 0.2, ly: 0.15, fov: 44 },
  { t: 0.46, az: 3.35, r: 3.1, y: 1.25, ly: 0.45, fov: 50 },
  { t: 0.58, az: 4.55, r: 3.3, y: -0.55, ly: -0.1, fov: 50 },
  { t: 0.72, az: 5.6, r: 4.0, y: 0.35, ly: 0.05, fov: 44 },
  { t: 1.0, az: 7.35, r: 4.5, y: 0.55, ly: 0.05, fov: 40 },
];

export interface PhaseState {
  camX: number;
  camY: number;
  camZ: number;
  lookY: number;
  fov: number;
  explode: number;
  reveal: number;
  heroFade: number;
}

const out: PhaseState = {
  camX: 0,
  camY: 0,
  camZ: 0,
  lookY: 0,
  fov: 40,
  explode: 0,
  reveal: 0,
  heroFade: 0,
};

export function computePhases(p: number): PhaseState {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const k = smooth((p - a.t) / (b.t - a.t));

  const az = a.az + (b.az - a.az) * k;
  const r = a.r + (b.r - a.r) * k;
  const y = a.y + (b.y - a.y) * k;

  out.camX = Math.sin(az) * r;
  out.camZ = Math.cos(az) * r;
  out.camY = y;
  out.lookY = a.ly + (b.ly - a.ly) * k;
  out.fov = a.fov + (b.fov - a.fov) * k;

  // layers separate on the way in, gather back before the reveal
  out.explode = seg(p, 0.34, 0.5) - seg(p, 0.58, 0.71);
  out.reveal = seg(p, 0.74, 0.88);
  out.heroFade = 1 - seg(p, 0.02, 0.13);

  return out;
}
