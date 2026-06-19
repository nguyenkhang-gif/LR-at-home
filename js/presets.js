const LS_KEY = 'lah_presets_v1';

export const PRESET_GROUPS = [
  { label: 'Film & Classic', ids: ['vintage', 'matte_film', 'kodak'] },
  { label: 'B&W', ids: ['bw_drama', 'bw_soft'] },
  { label: 'Cinematic', ids: ['teal_orange', 'cold_blue', 'moody_dark'] },
  { label: 'Bright & Airy', ids: ['summer', 'sharp_pop'] },
  { label: 'Artistic', ids: ['edge_art', 'lo_fi', 'faded'] },
  { label: 'Anime', ids: ['kimi_no_na_wa', 'spirited_away', 'your_lie'] },
];

export const BUILTIN_PRESETS = [
  // ── Film & Classic ──
  {
    id: 'vintage',
    name: 'Vintage',
    chain: [
      { filterId: 'sepia', params: { intensity: 0.75 } },
      { filterId: 'brightness', params: { value: -15 } },
      { filterId: 'contrast', params: { factor: 1.15 } },
      { filterId: 'vignette', params: { strength: 0.5 } },
    ],
  },
  {
    id: 'matte_film',
    name: 'Matte Film',
    chain: [
      { filterId: 'contrast', params: { factor: 0.85 } },
      { filterId: 'blacks', params: { value: 0.4 } },
      { filterId: 'highlights', params: { value: -0.3 } },
      { filterId: 'grain', params: { amount: 0.15 } },
    ],
  },
  {
    id: 'kodak',
    name: 'Kodak',
    chain: [
      { filterId: 'brightness', params: { value: 10 } },
      { filterId: 'contrast', params: { factor: 1.1 } },
      { filterId: 'saturation', params: { factor: 1.3 } },
      { filterId: 'highlights', params: { value: -0.15 } },
      { filterId: 'shadows', params: { value: 0.1 } },
      { filterId: 'grain', params: { amount: 0.08 } },
    ],
  },
  // ── B&W ──
  {
    id: 'bw_drama',
    name: 'B&W Drama',
    chain: [
      { filterId: 'grayscale', params: { intensity: 1 } },
      { filterId: 'contrast', params: { factor: 1.6 } },
      { filterId: 'brightness', params: { value: -20 } },
      { filterId: 'vignette', params: { strength: 0.6 } },
    ],
  },
  {
    id: 'bw_soft',
    name: 'B&W Soft',
    chain: [
      { filterId: 'grayscale', params: { intensity: 1 } },
      { filterId: 'brightness', params: { value: 20 } },
      { filterId: 'contrast', params: { factor: 0.9 } },
      { filterId: 'box_blur', params: { radius: 1 } },
    ],
  },
  // ── Cinematic ──
  {
    id: 'teal_orange',
    name: 'Teal & Orange',
    chain: [
      { filterId: 'hue_rotate', params: { degrees: 15 } },
      { filterId: 'saturation', params: { factor: 1.4 } },
      { filterId: 'contrast', params: { factor: 1.15 } },
      { filterId: 'vignette', params: { strength: 0.4 } },
    ],
  },
  {
    id: 'cold_blue',
    name: 'Cold Blue',
    chain: [
      { filterId: 'hue_rotate', params: { degrees: 200 } },
      { filterId: 'contrast', params: { factor: 1.1 } },
      { filterId: 'shadows', params: { value: -0.15 } },
    ],
  },
  {
    id: 'moody_dark',
    name: 'Moody Dark',
    chain: [
      { filterId: 'exposure', params: { stops: -0.7 } },
      { filterId: 'contrast', params: { factor: 1.4 } },
      { filterId: 'highlights', params: { value: -0.5 } },
      { filterId: 'saturation', params: { factor: 0.8 } },
      { filterId: 'vignette', params: { strength: 0.7 } },
    ],
  },
  // ── Bright & Airy ──
  {
    id: 'summer',
    name: 'Summer',
    chain: [
      { filterId: 'exposure', params: { stops: 0.4 } },
      { filterId: 'highlights', params: { value: -0.2 } },
      { filterId: 'saturation', params: { factor: 1.5 } },
      { filterId: 'brightness', params: { value: 10 } },
    ],
  },
  {
    id: 'sharp_pop',
    name: 'Sharp Pop',
    chain: [
      { filterId: 'sharpen', params: { amount: 2 } },
      { filterId: 'contrast', params: { factor: 1.3 } },
      { filterId: 'brightness', params: { value: 15 } },
      { filterId: 'saturation', params: { factor: 1.2 } },
    ],
  },
  // ── Artistic ──
  {
    id: 'edge_art',
    name: 'Edge Art',
    chain: [
      { filterId: 'edge_detect', params: { sensitivity: 1.5 } },
      { filterId: 'invert', params: { intensity: 1 } },
    ],
  },
  {
    id: 'lo_fi',
    name: 'Lo-Fi',
    chain: [
      { filterId: 'contrast', params: { factor: 1.5 } },
      { filterId: 'saturation', params: { factor: 1.8 } },
      { filterId: 'vignette', params: { strength: 0.8 } },
      { filterId: 'grain', params: { amount: 0.25 } },
    ],
  },
  {
    id: 'faded',
    name: 'Faded',
    chain: [
      { filterId: 'blacks', params: { value: 0.5 } },
      { filterId: 'whites', params: { value: -0.3 } },
      { filterId: 'saturation', params: { factor: 0.7 } },
      { filterId: 'sepia', params: { intensity: 0.15 } },
    ],
  },
  // ── Anime ──
  {
    id: 'kimi_no_na_wa',
    name: 'Kimi no Na wa',
    chain: [
      { filterId: 'exposure',    params: { stops: 0.8 } },
      { filterId: 'contrast',    params: { factor: 1.06 } },
      { filterId: 'highlights',  params: { value: -0.61 } },
      { filterId: 'shadows',     params: { value: 0.89 } },
      { filterId: 'whites',      params: { value: 0.49 } },
      { filterId: 'blacks',      params: { value: 0.49 } },
      { filterId: 'saturation',  params: { factor: 1.34 } },
      { filterId: 'sharpen',     params: { amount: 0.5 } },
      { filterId: 'box_blur',    params: { radius: 1 } },
      { filterId: 'grain',       params: { amount: 0.54 } },
    ],
  },
  {
    id: 'spirited_away',
    name: 'Spirited Away',
    chain: [
      { filterId: 'exposure',     params: { stops: 0.2 } },
      { filterId: 'contrast',     params: { factor: 1.1 } },
      { filterId: 'color_grade',  params: { shadow_hue: 220, shadow_sat: 0.4, mid_hue: 60, mid_sat: 0.2, hi_hue: 45, hi_sat: 0.3 } },
      { filterId: 'saturation',   params: { factor: 1.4 } },
      { filterId: 'brightness',   params: { value: 8 } },
    ],
  },
  {
    id: 'your_lie',
    name: 'Your Lie in April',
    chain: [
      { filterId: 'brightness',   params: { value: 20 } },
      { filterId: 'contrast',     params: { factor: 0.9 } },
      { filterId: 'color_grade',  params: { shadow_hue: 240, shadow_sat: 0.3, mid_hue: 30, mid_sat: 0.15, hi_hue: 50, hi_sat: 0.4 } },
      { filterId: 'saturation',   params: { factor: 1.2 } },
      { filterId: 'highlights',   params: { value: 0.15 } },
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

export function exportPresets() {
  const presets = loadUserPresets();
  if (presets.length === 0) return false;
  const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `lah-presets-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  return true;
}

export function importPresets(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const incoming = JSON.parse(e.target.result);
        if (!Array.isArray(incoming)) throw new Error('Invalid format');
        const valid = incoming.filter((p) =>
          p.name && Array.isArray(p.chain) &&
          p.chain.every((l) => l.filterId && typeof l.params === 'object')
        );
        if (valid.length === 0) throw new Error('No valid presets found');
        const existing = loadUserPresets();
        const existingNames = new Set(existing.map((p) => p.name));
        const merged = [...existing];
        let added = 0;
        for (const p of valid) {
          if (!existingNames.has(p.name)) {
            merged.push({ ...p, id: `user_${Date.now()}_${added}` });
            added++;
          }
        }
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
        resolve(added);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
