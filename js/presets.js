const LS_KEY = 'lah_presets_v1';

export const BUILTIN_PRESETS = [
  {
    id: 'vintage',
    name: 'Vintage',
    chain: [
      { filterId: 'sepia', params: { intensity: 0.75 } },
      { filterId: 'brightness', params: { value: -15 } },
      { filterId: 'contrast', params: { factor: 1.15 } },
    ],
  },
  {
    id: 'bw_drama',
    name: 'B&W Drama',
    chain: [
      { filterId: 'grayscale', params: { intensity: 1 } },
      { filterId: 'contrast', params: { factor: 1.6 } },
      { filterId: 'brightness', params: { value: -20 } },
    ],
  },
  {
    id: 'cold_blue',
    name: 'Cold Blue',
    chain: [
      { filterId: 'hue_rotate', params: { degrees: 200 } },
      { filterId: 'contrast', params: { factor: 1.1 } },
    ],
  },
  {
    id: 'sharp_pop',
    name: 'Sharp Pop',
    chain: [
      { filterId: 'sharpen', params: { amount: 2 } },
      { filterId: 'contrast', params: { factor: 1.3 } },
      { filterId: 'brightness', params: { value: 15 } },
    ],
  },
  {
    id: 'edge_art',
    name: 'Edge Art',
    chain: [
      { filterId: 'edge_detect', params: { sensitivity: 1.5 } },
      { filterId: 'invert', params: { intensity: 1 } },
    ],
  },
];

export function loadUserPresets() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveUserPreset(name, chain) {
  const presets = loadUserPresets();
  const preset = {
    id: `user_${Date.now()}`,
    name,
    chain: chain.map(({ filterId, params }) => ({ filterId, params: { ...params } })),
  };
  presets.push(preset);
  localStorage.setItem(LS_KEY, JSON.stringify(presets));
  return preset;
}

export function deleteUserPreset(id) {
  const presets = loadUserPresets().filter((p) => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(presets));
}
