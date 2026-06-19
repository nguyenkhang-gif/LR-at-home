export const FILTER_GROUPS = [
  { label: 'Light', ids: ['exposure', 'highlights', 'shadows', 'whites', 'blacks', 'brightness', 'contrast'] },
  { label: 'Color', ids: ['grayscale', 'sepia', 'saturation', 'hue_rotate', 'invert', 'color_grade'] },
  { label: 'Detail', ids: ['box_blur', 'sharpen'] },
  { label: 'Artistic', ids: ['edge_detect', 'threshold'] },
  { label: 'Effects', ids: ['vignette', 'grain'] },
];

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
    id: 'color_grade', name: 'Color Grading',
    params: [
      { id: 'shadow_hue', label: 'Shadow Hue',  min: 0, max: 360, default: 180, step: 1 },
      { id: 'shadow_sat', label: 'Shadow Sat',  min: 0, max: 1,   default: 0,   step: 0.01 },
      { id: 'mid_hue',    label: 'Mid Hue',     min: 0, max: 360, default: 0,   step: 1 },
      { id: 'mid_sat',    label: 'Mid Sat',     min: 0, max: 1,   default: 0,   step: 0.01 },
      { id: 'hi_hue',     label: 'Highlight Hue', min: 0, max: 360, default: 30, step: 1 },
      { id: 'hi_sat',     label: 'Highlight Sat', min: 0, max: 1,   default: 0,  step: 0.01 },
    ],
    apply: (wasm, data, p) => wasm.color_grade(
      data.data,
      p.shadow_hue, p.shadow_sat,
      p.mid_hue,    p.mid_sat,
      p.hi_hue,     p.hi_sat,
    ),
  },
];
