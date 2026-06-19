export const FILTER_GROUPS = [
  { label: 'Light', ids: ['exposure', 'highlights', 'shadows', 'whites', 'blacks', 'brightness', 'contrast', 'tone_curve'] },
  { label: 'Color', ids: ['temperature', 'tint', 'saturation', 'hue_rotate', 'color_grade', 'hsl_adjust'] },
  { label: 'Presence', ids: ['clarity', 'dehaze', 'sharpen', 'box_blur'] },
  { label: 'Creative', ids: ['grayscale', 'sepia', 'invert', 'vignette', 'grain'] },
  { label: 'Artistic', ids: ['edge_detect', 'threshold'] },
];

// Catmull-Rom spline through (input→output) control points, returns 256-byte LUT
export function buildCurveLut(pts) {
  const lut = new Uint8Array(256);
  const n = pts.length;
  if (n === 0) { for (let i = 0; i < 256; i++) lut[i] = i; return lut; }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  for (let x = 0; x <= 255; x++) {
    let i = 1;
    while (i < n - 1 && xs[i] <= x) i++;
    const x0 = xs[i - 1], x1 = xs[i];
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    const y0 = ys[i - 1], y1 = ys[i];
    const ym1 = i > 1 ? ys[i - 2] : y0;
    const y2  = i < n - 1 ? ys[i + 1] : y1;
    const val = 0.5 * (
      2 * y0 + (-ym1 + y1) * t +
      (2 * ym1 - 5 * y0 + 4 * y1 - y2) * t * t +
      (-ym1 + 3 * y0 - 3 * y1 + y2) * t * t * t
    );
    lut[x] = Math.round(Math.max(0, Math.min(255, val)));
  }
  return lut;
}

export const FILTERS = [
  {
    id: 'grayscale', name: 'Grayscale',
    params: [{ id: 'intensity', label: 'Intensity', min: 0, max: 1, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.grayscale(data.data, p.intensity),
  },
  {
    id: 'invert', name: 'Invert',
    params: [{ id: 'intensity', label: 'Intensity', min: 0, max: 1, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.invert(data.data, p.intensity),
  },
  {
    id: 'sepia', name: 'Sepia',
    params: [{ id: 'intensity', label: 'Intensity', min: 0, max: 1, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.sepia(data.data, p.intensity),
  },
  {
    id: 'exposure', name: 'Exposure',
    params: [{ id: 'stops', label: 'Stops', min: -5, max: 5, default: 0, step: 0.1 }],
    apply: (wasm, data, p) => wasm.exposure(data.data, p.stops),
  },
  {
    id: 'highlights', name: 'Highlights',
    params: [{ id: 'value', label: 'Value', min: -1, max: 1, default: 0, step: 0.01 }],
    apply: (wasm, data, p) => wasm.highlights(data.data, p.value),
  },
  {
    id: 'shadows', name: 'Shadows',
    params: [{ id: 'value', label: 'Value', min: -1, max: 1, default: 0, step: 0.01 }],
    apply: (wasm, data, p) => wasm.shadows(data.data, p.value),
  },
  {
    id: 'whites', name: 'Whites',
    params: [{ id: 'value', label: 'Value', min: -1, max: 1, default: 0, step: 0.01 }],
    apply: (wasm, data, p) => wasm.whites(data.data, p.value),
  },
  {
    id: 'blacks', name: 'Blacks',
    params: [{ id: 'value', label: 'Value', min: -1, max: 1, default: 0, step: 0.01 }],
    apply: (wasm, data, p) => wasm.blacks(data.data, p.value),
  },
  {
    id: 'brightness', name: 'Brightness',
    params: [{ id: 'value', label: 'Value', min: -255, max: 255, default: 0, step: 1 }],
    apply: (wasm, data, p) => wasm.brightness(data.data, p.value),
  },
  {
    id: 'contrast', name: 'Contrast',
    params: [{ id: 'factor', label: 'Factor', min: 0, max: 3, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.contrast(data.data, p.factor),
  },
  {
    id: 'box_blur', name: 'Blur',
    params: [{ id: 'radius', label: 'Radius', min: 1, max: 10, default: 2, step: 1 }],
    apply: (wasm, data, p) => wasm.box_blur(data.data, data.width, data.height, p.radius),
  },
  {
    id: 'edge_detect', name: 'Edge Detect',
    params: [{ id: 'sensitivity', label: 'Sensitivity', min: 0.1, max: 5, default: 1, step: 0.1 }],
    apply: (wasm, data, p) => wasm.edge_detect(data.data, data.width, data.height, p.sensitivity),
  },
  {
    id: 'threshold', name: 'Threshold',
    params: [{ id: 'value', label: 'Value', min: 0, max: 255, default: 128, step: 1 }],
    apply: (wasm, data, p) => wasm.threshold(data.data, p.value),
  },
  {
    id: 'sharpen', name: 'Sharpen',
    params: [{ id: 'amount', label: 'Amount', min: 0, max: 3, default: 1, step: 0.1 }],
    apply: (wasm, data, p) => wasm.sharpen(data.data, data.width, data.height, p.amount),
  },
  {
    id: 'saturation', name: 'Saturation',
    params: [{ id: 'factor', label: 'Factor', min: 0, max: 3, default: 1.5, step: 0.01 }],
    apply: (wasm, data, p) => wasm.saturation(data.data, p.factor),
  },
  {
    id: 'vignette', name: 'Vignette',
    params: [{ id: 'strength', label: 'Intensity', min: 0, max: 1, default: 0.7, step: 0.01 }],
    apply: (wasm, data, p) => wasm.vignette(data.data, data.width, data.height, p.strength),
  },
  {
    id: 'grain', name: 'Film Grain',
    params: [{ id: 'amount', label: 'Amount', min: 0, max: 1, default: 0.2, step: 0.01 }],
    apply: (wasm, data, p) => wasm.grain(data.data, p.amount),
  },
  {
    id: 'hue_rotate', name: 'Hue Rotate',
    params: [{ id: 'degrees', label: 'Angle', min: 0, max: 360, default: 180, step: 1 }],
    apply: (wasm, data, p) => wasm.hue_rotate(data.data, p.degrees),
  },
  {
    id: 'temperature', name: 'Temperature',
    params: [{ id: 'value', label: 'Temp', min: -100, max: 100, default: 0, step: 1 }],
    apply: (wasm, data, p) => wasm.temperature(data.data, p.value / 100),
  },
  {
    id: 'tint', name: 'Tint',
    params: [{ id: 'value', label: 'Tint', min: -100, max: 100, default: 0, step: 1 }],
    apply: (wasm, data, p) => wasm.tint(data.data, p.value / 100),
  },
  {
    id: 'clarity', name: 'Clarity',
    params: [{ id: 'amount', label: 'Amount', min: -100, max: 100, default: 0, step: 1 }],
    apply: (wasm, data, p) => wasm.clarity(data.data, data.width, data.height, p.amount / 100),
  },
  {
    id: 'dehaze', name: 'Dehaze',
    params: [{ id: 'amount', label: 'Amount', min: -100, max: 100, default: 0, step: 1 }],
    apply: (wasm, data, p) => wasm.dehaze(data.data, p.amount / 100),
  },
  {
    id: 'hsl_adjust', name: 'HSL',
    hint: () => 'per-color H/S/L',
    params: [
      { id: 'r_h', label: 'Red — Hue',      min: -180, max: 180, default: 0, step: 1 },
      { id: 'r_s', label: 'Red — Sat',       min: -100, max: 100, default: 0, step: 1 },
      { id: 'r_l', label: 'Red — Lum',       min: -100, max: 100, default: 0, step: 1 },
      { id: 'o_h', label: 'Orange — Hue',    min: -180, max: 180, default: 0, step: 1 },
      { id: 'o_s', label: 'Orange — Sat',    min: -100, max: 100, default: 0, step: 1 },
      { id: 'o_l', label: 'Orange — Lum',    min: -100, max: 100, default: 0, step: 1 },
      { id: 'y_h', label: 'Yellow — Hue',    min: -180, max: 180, default: 0, step: 1 },
      { id: 'y_s', label: 'Yellow — Sat',    min: -100, max: 100, default: 0, step: 1 },
      { id: 'y_l', label: 'Yellow — Lum',    min: -100, max: 100, default: 0, step: 1 },
      { id: 'g_h', label: 'Green — Hue',     min: -180, max: 180, default: 0, step: 1 },
      { id: 'g_s', label: 'Green — Sat',     min: -100, max: 100, default: 0, step: 1 },
      { id: 'g_l', label: 'Green — Lum',     min: -100, max: 100, default: 0, step: 1 },
      { id: 'a_h', label: 'Aqua — Hue',      min: -180, max: 180, default: 0, step: 1 },
      { id: 'a_s', label: 'Aqua — Sat',      min: -100, max: 100, default: 0, step: 1 },
      { id: 'a_l', label: 'Aqua — Lum',      min: -100, max: 100, default: 0, step: 1 },
      { id: 'b_h', label: 'Blue — Hue',      min: -180, max: 180, default: 0, step: 1 },
      { id: 'b_s', label: 'Blue — Sat',      min: -100, max: 100, default: 0, step: 1 },
      { id: 'b_l', label: 'Blue — Lum',      min: -100, max: 100, default: 0, step: 1 },
      { id: 'p_h', label: 'Purple — Hue',    min: -180, max: 180, default: 0, step: 1 },
      { id: 'p_s', label: 'Purple — Sat',    min: -100, max: 100, default: 0, step: 1 },
      { id: 'p_l', label: 'Purple — Lum',    min: -100, max: 100, default: 0, step: 1 },
      { id: 'm_h', label: 'Magenta — Hue',   min: -180, max: 180, default: 0, step: 1 },
      { id: 'm_s', label: 'Magenta — Sat',   min: -100, max: 100, default: 0, step: 1 },
      { id: 'm_l', label: 'Magenta — Lum',   min: -100, max: 100, default: 0, step: 1 },
    ],
    apply: (wasm, data, p) => wasm.hsl_adjust(
      data.data,
      p.r_h, p.r_s, p.r_l,
      p.o_h, p.o_s, p.o_l,
      p.y_h, p.y_s, p.y_l,
      p.g_h, p.g_s, p.g_l,
      p.a_h, p.a_s, p.a_l,
      p.b_h, p.b_s, p.b_l,
      p.p_h, p.p_s, p.p_l,
      p.m_h, p.m_s, p.m_l,
    ),
  },
  {
    id: 'tone_curve', name: 'Tone Curve',
    hint: (p) => `B:${p.p0 ?? 0} M:${p.p2 ?? 128} W:${p.p4 ?? 255}`,
    params: [
      { id: 'p0', label: 'Blacks',   min: 0, max: 255, default: 0,   step: 1 },
      { id: 'p1', label: 'Shadows',  min: 0, max: 255, default: 64,  step: 1 },
      { id: 'p2', label: 'Midtones', min: 0, max: 255, default: 128, step: 1 },
      { id: 'p3', label: 'Lights',   min: 0, max: 255, default: 192, step: 1 },
      { id: 'p4', label: 'Whites',   min: 0, max: 255, default: 255, step: 1 },
    ],
    apply: (wasm, data, p) => {
      const lut = buildCurveLut([
        [0, p.p0], [64, p.p1], [128, p.p2], [192, p.p3], [255, p.p4],
      ]);
      wasm.apply_lut(data.data, lut);
    },
  },
  {
    id: 'color_grade', name: 'Color Grading',
    hint: (p) => `S ${Math.round(p.shadow_hue ?? 180)}° · M ${Math.round(p.mid_hue ?? 0)}° · H ${Math.round(p.hi_hue ?? 30)}°`,
    params: [
      { id: 'shadow_hue', label: 'Shadow Hue',  min: 0, max: 360, default: 180, step: 1 },
      { id: 'shadow_sat', label: 'Shadow Sat',  min: 0, max: 1,   default: 0,   step: 0.01 },
      { id: 'shadow_lum', label: 'Shadow Lum',  min: -1, max: 1,  default: 0,   step: 0.01 },
      { id: 'mid_hue',    label: 'Mid Hue',     min: 0, max: 360, default: 0,   step: 1 },
      { id: 'mid_sat',    label: 'Mid Sat',     min: 0, max: 1,   default: 0,   step: 0.01 },
      { id: 'mid_lum',    label: 'Mid Lum',     min: -1, max: 1,  default: 0,   step: 0.01 },
      { id: 'hi_hue',     label: 'Highlight Hue', min: 0, max: 360, default: 30, step: 1 },
      { id: 'hi_sat',     label: 'Highlight Sat', min: 0, max: 1,   default: 0,  step: 0.01 },
      { id: 'hi_lum',     label: 'Highlight Lum', min: -1, max: 1,  default: 0,  step: 0.01 },
    ],
    apply: (wasm, data, p) => wasm.color_grade(
      data.data,
      p.shadow_hue, p.shadow_sat, p.shadow_lum ?? 0,
      p.mid_hue,    p.mid_sat,    p.mid_lum    ?? 0,
      p.hi_hue,     p.hi_sat,     p.hi_lum     ?? 0,
    ),
  },
];
