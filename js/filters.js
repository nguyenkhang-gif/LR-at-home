export const FILTER_GROUPS = [
  { label: 'Ánh sáng', ids: ['exposure', 'brightness', 'contrast'] },
  { label: 'Màu sắc', ids: ['grayscale', 'sepia', 'saturation', 'hue_rotate', 'invert'] },
  { label: 'Chi tiết', ids: ['box_blur', 'sharpen'] },
  { label: 'Nghệ thuật', ids: ['edge_detect', 'threshold'] },
  { label: 'Hiệu ứng', ids: ['vignette', 'grain'] },
];

export const FILTERS = [
  {
    id: 'grayscale', name: 'Grayscale',
    params: [{ id: 'intensity', label: 'Cường độ', min: 0, max: 1, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.grayscale(data.data, p.intensity),
  },
  {
    id: 'invert', name: 'Đảo màu',
    params: [{ id: 'intensity', label: 'Cường độ', min: 0, max: 1, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.invert(data.data, p.intensity),
  },
  {
    id: 'sepia', name: 'Sepia',
    params: [{ id: 'intensity', label: 'Cường độ', min: 0, max: 1, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.sepia(data.data, p.intensity),
  },
  {
    id: 'exposure', name: 'Exposure',
    params: [{ id: 'stops', label: 'Stops', min: -5, max: 5, default: 0, step: 0.1 }],
    apply: (wasm, data, p) => wasm.exposure(data.data, p.stops),
  },
  {
    id: 'brightness', name: 'Sáng',
    params: [{ id: 'value', label: 'Giá trị', min: -255, max: 255, default: 0, step: 1 }],
    apply: (wasm, data, p) => wasm.brightness(data.data, p.value),
  },
  {
    id: 'contrast', name: 'Tương phản',
    params: [{ id: 'factor', label: 'Hệ số', min: 0, max: 3, default: 1, step: 0.01 }],
    apply: (wasm, data, p) => wasm.contrast(data.data, p.factor),
  },
  {
    id: 'box_blur', name: 'Làm mờ',
    params: [{ id: 'radius', label: 'Bán kính', min: 1, max: 10, default: 2, step: 1 }],
    apply: (wasm, data, p) => wasm.box_blur(data.data, data.width, data.height, p.radius),
  },
  {
    id: 'edge_detect', name: 'Phát hiện cạnh',
    params: [{ id: 'sensitivity', label: 'Độ nhạy', min: 0.1, max: 5, default: 1, step: 0.1 }],
    apply: (wasm, data, p) => wasm.edge_detect(data.data, data.width, data.height, p.sensitivity),
  },
  {
    id: 'threshold', name: 'Ngưỡng',
    params: [{ id: 'value', label: 'Giá trị', min: 0, max: 255, default: 128, step: 1 }],
    apply: (wasm, data, p) => wasm.threshold(data.data, p.value),
  },
  {
    id: 'sharpen', name: 'Làm sắc nét',
    params: [{ id: 'amount', label: 'Mức độ', min: 0, max: 3, default: 1, step: 0.1 }],
    apply: (wasm, data, p) => wasm.sharpen(data.data, data.width, data.height, p.amount),
  },
  {
    id: 'saturation', name: 'Bão hòa màu',
    params: [{ id: 'factor', label: 'Hệ số', min: 0, max: 3, default: 1.5, step: 0.01 }],
    apply: (wasm, data, p) => wasm.saturation(data.data, p.factor),
  },
  {
    id: 'vignette', name: 'Vignette',
    params: [{ id: 'strength', label: 'Cường độ', min: 0, max: 1, default: 0.7, step: 0.01 }],
    apply: (wasm, data, p) => wasm.vignette(data.data, data.width, data.height, p.strength),
  },
  {
    id: 'grain', name: 'Film Grain',
    params: [{ id: 'amount', label: 'Lượng', min: 0, max: 1, default: 0.2, step: 0.01 }],
    apply: (wasm, data, p) => wasm.grain(data.data, p.amount),
  },
  {
    id: 'hue_rotate', name: 'Xoay màu sắc',
    params: [{ id: 'degrees', label: 'Góc', min: 0, max: 360, default: 180, step: 1 }],
    apply: (wasm, data, p) => wasm.hue_rotate(data.data, p.degrees),
  },
];
