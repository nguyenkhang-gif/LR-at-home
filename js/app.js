import { getWasm } from './wasmLoader.js';
import { FILTERS, FILTER_GROUPS } from './filters.js';
import { BUILTIN_PRESETS, loadUserPresets, saveUserPreset, deleteUserPreset } from './presets.js';

// ── State ──────────────────────────────────────────────────────────────────
let wasm = null;
let hasImage = false;
let showSplit = false;
let splitX = 50;
let splitDragging = false;

// Filter chain: [{uid, filterId, params: {paramId: value}}]
let filterChain = [];
let selectedLayerUid = null;
let nextUid = 1;

// Drag-to-reorder state
let dragSrcUid = null;

// ── DOM ────────────────────────────────────────────────────────────────────
const originalCanvas = document.getElementById('canvas-original');
const outputCanvas = document.getElementById('canvas-output');
const splitOrigCanvas = document.getElementById('canvas-original-s');
const splitOutCanvas = document.getElementById('canvas-output-s');
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const filterGrid = document.getElementById('filter-grid');
const paramPanel = document.getElementById('param-panel');
const paramSection = document.getElementById('param-section');
const paramTitle = document.getElementById('param-title');
const chainSection = document.getElementById('chain-section');
const layerList = document.getElementById('layer-list');
const statsBar = document.getElementById('stats-bar');
const btnReset = document.getElementById('btn-reset');
const btnDownload = document.getElementById('btn-download');
const btnSplit = document.getElementById('btn-split');
const btnClearChain = document.getElementById('btn-clear-chain');
const splitContainer = document.getElementById('split-container');
const splitOrig = document.getElementById('split-orig');
const splitInner = document.getElementById('split-inner');
const bothGrid = document.getElementById('both-grid');
const wasmStatus = document.getElementById('wasm-status');
const sidebarControls = document.getElementById('sidebar-controls');
const emptyHint = document.getElementById('empty-hint');
const uploadName = document.getElementById('upload-name');
const presetList = document.getElementById('preset-list');
const btnSavePreset = document.getElementById('btn-save-preset');

// ── WASM init ──────────────────────────────────────────────────────────────
getWasm()
  .then((w) => { wasm = w; wasmStatus.textContent = 'WASM sẵn sàng'; wasmStatus.className = 'status-badge ready'; })
  .catch(() => { wasmStatus.textContent = 'WASM lỗi'; wasmStatus.className = 'status-badge error'; });

// ── Upload ─────────────────────────────────────────────────────────────────
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => { e.preventDefault(); uploadZone.classList.remove('drag-over'); handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', () => { handleFile(fileInput.files[0]); fileInput.value = ''; });

function handleFile(file) {
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { alert('Chỉ chấp nhận JPEG, PNG, WebP'); return; }
  if (file.size > 20 * 1024 * 1024) { alert('Ảnh tối đa 20MB'); return; }

  uploadName.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w >= h) { h = Math.round(h / w * MAX); w = MAX; }
        else { w = Math.round(w / h * MAX); h = MAX; }
      }
      [originalCanvas, outputCanvas, splitOrigCanvas, splitOutCanvas].forEach((c) => { c.width = w; c.height = h; });
      originalCanvas.getContext('2d').drawImage(img, 0, 0, w, h);
      outputCanvas.getContext('2d').drawImage(img, 0, 0, w, h);
      splitOrigCanvas.getContext('2d').drawImage(img, 0, 0, w, h);
      splitOutCanvas.getContext('2d').drawImage(img, 0, 0, w, h);
      syncSplitSize(w, h);

      hasImage = true;
      filterChain = [];
      selectedLayerUid = null;
      statsBar.innerHTML = '';
      emptyHint.style.display = 'none';
      sidebarControls.style.display = 'block';
      renderChainUI();
      updateView();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Filter buttons ─────────────────────────────────────────────────────────
const SHORTCUT_KEYS = ['1','2','3','4','5','6','7','8','9','0'];
const FILTER_SHORTCUT = Object.fromEntries(FILTERS.map((f, i) => [f.id, SHORTCUT_KEYS[i]]));

FILTER_GROUPS.forEach((group) => {
  const label = document.createElement('p');
  label.className = 'filter-group-label';
  label.textContent = group.label;
  filterGrid.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'filter-grid';
  group.ids.forEach((id) => {
    const f = FILTERS.find((x) => x.id === id);
    if (!f) return;
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.id = f.id;
    const key = FILTER_SHORTCUT[f.id];
    btn.innerHTML = `${f.name}${key ? `<span class="btn-num">${key}</span>` : ''}`;
    btn.addEventListener('click', () => addLayer(f.id));
    grid.appendChild(btn);
  });
  filterGrid.appendChild(grid);
});

// ── Layer chain logic ──────────────────────────────────────────────────────
function addLayer(filterId) {
  const filter = FILTERS.find((f) => f.id === filterId);
  const params = {};
  for (const p of filter.params) params[p.id] = p.default;
  const layer = { uid: nextUid++, filterId, params, visible: true, opacity: 1 };
  filterChain.push(layer);
  selectedLayerUid = layer.uid;
  renderChainUI();
  applyChain();
}

function removeLayer(uid) {
  filterChain = filterChain.filter((l) => l.uid !== uid);
  if (selectedLayerUid === uid) {
    selectedLayerUid = filterChain.length > 0 ? filterChain[filterChain.length - 1].uid : null;
  }
  renderChainUI();
  applyChain();
}

function selectLayer(uid) {
  selectedLayerUid = uid;
  renderParamPanel();
  renderLayerListHighlight();
}

function moveLayer(fromUid, toUid, position) {
  const fromIdx = filterChain.findIndex((l) => l.uid === fromUid);
  const toIdx = filterChain.findIndex((l) => l.uid === toUid);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
  const [moved] = filterChain.splice(fromIdx, 1);
  const insertAt = filterChain.findIndex((l) => l.uid === toUid);
  filterChain.splice(position === 'before' ? insertAt : insertAt + 1, 0, moved);
  renderChainUI();
  applyChain();
}

function selectPrevLayer() {
  if (filterChain.length === 0) return;
  const idx = filterChain.findIndex((l) => l.uid === selectedLayerUid);
  const newIdx = idx <= 0 ? filterChain.length - 1 : idx - 1;
  selectLayer(filterChain[newIdx].uid);
}

function selectNextLayer() {
  if (filterChain.length === 0) return;
  const idx = filterChain.findIndex((l) => l.uid === selectedLayerUid);
  const newIdx = idx >= filterChain.length - 1 ? 0 : idx + 1;
  selectLayer(filterChain[newIdx].uid);
}

const EYE_OPEN = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_CLOSED = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>`;

// ── Render chain UI ────────────────────────────────────────────────────────
function renderChainUI() {
  renderLayerList();
  renderParamPanel();
  chainSection.style.display = filterChain.length > 0 ? '' : 'none';
}

function renderLayerList() {
  layerList.innerHTML = '';
  for (const layer of filterChain) {
    const filter = FILTERS.find((f) => f.id === layer.filterId);
    const paramHint = buildParamHint(filter, layer.params);

    const li = document.createElement('li');
    li.className = 'layer-item' + (layer.uid === selectedLayerUid ? ' active' : '');
    li.dataset.uid = layer.uid;
    li.draggable = true;
    li.innerHTML = `
      <span class="layer-drag" title="Kéo để sắp xếp">⠿</span>
      <button class="layer-eye ${layer.visible ? '' : 'hidden'}" data-uid="${layer.uid}" title="${layer.visible ? 'Ẩn layer' : 'Hiện layer'}">
        ${layer.visible ? EYE_OPEN : EYE_CLOSED}
      </button>
      <span class="layer-name ${layer.visible ? '' : 'muted'}">${filter.name}</span>
      <span class="layer-param-hint">${paramHint}</span>
      <button class="layer-remove" data-uid="${layer.uid}" title="Xóa layer">×</button>
    `;

    li.addEventListener('click', (e) => {
      if (e.target.closest('.layer-remove') || e.target.closest('.layer-eye')) return;
      selectLayer(layer.uid);
    });
    li.querySelector('.layer-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeLayer(layer.uid);
    });
    li.querySelector('.layer-eye').addEventListener('click', (e) => {
      e.stopPropagation();
      layer.visible = !layer.visible;
      applyChain();
      // update just this button + name without full re-render
      const btn = e.currentTarget;
      btn.innerHTML = layer.visible ? EYE_OPEN : EYE_CLOSED;
      btn.title = layer.visible ? 'Ẩn layer' : 'Hiện layer';
      btn.classList.toggle('hidden', !layer.visible);
      btn.closest('.layer-item').querySelector('.layer-name').classList.toggle('muted', !layer.visible);
    });

    // Drag-and-drop
    li.addEventListener('dragstart', (e) => {
      dragSrcUid = layer.uid;
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      document.querySelectorAll('.layer-item').forEach((el) => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
    });
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dragSrcUid === layer.uid) return;
      const rect = li.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      li.classList.remove('drag-over-top', 'drag-over-bottom');
      li.classList.add(e.clientY < mid ? 'drag-over-top' : 'drag-over-bottom');
    });
    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!dragSrcUid || dragSrcUid === layer.uid) return;
      const rect = li.getBoundingClientRect();
      const pos = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
      moveLayer(dragSrcUid, layer.uid, pos);
      dragSrcUid = null;
    });

    layerList.appendChild(li);
  }
}

function renderLayerListHighlight() {
  document.querySelectorAll('.layer-item').forEach((el) => {
    el.classList.toggle('active', parseInt(el.dataset.uid) === selectedLayerUid);
  });
}

function buildParamHint(filter, params) {
  const parts = filter.params.map((p) => {
    const v = params[p.id] ?? p.default;
    return p.step < 1 ? Number(v).toFixed(1) : String(Math.round(v));
  });
  return parts.join(' · ');
}

function renderParamPanel() {
  const layer = filterChain.find((l) => l.uid === selectedLayerUid);
  if (!layer) { paramSection.style.display = 'none'; return; }

  const filter = FILTERS.find((f) => f.id === layer.filterId);
  paramSection.style.display = '';
  paramTitle.textContent = filter.name;
  paramPanel.innerHTML = '';

  // Opacity row (always first)
  const opRow = document.createElement('div');
  opRow.className = 'param-row';
  const opValId = `pv-${layer.uid}-opacity`;
  opRow.innerHTML = `
    <div class="param-label">
      <span>Độ mờ</span>
      <span class="param-value" id="${opValId}">${Math.round((layer.opacity ?? 1) * 100)}%</span>
    </div>
    <input type="range" min="0" max="1" step="0.01" value="${layer.opacity ?? 1}" />
  `;
  opRow.querySelector('input').addEventListener('input', (e) => {
    layer.opacity = parseFloat(e.target.value);
    document.getElementById(opValId).textContent = Math.round(layer.opacity * 100) + '%';
    clearTimeout(opRow._db);
    opRow._db = setTimeout(applyChain, 50);
  });
  paramPanel.appendChild(opRow);

  for (const p of filter.params) {
    const val = layer.params[p.id] ?? p.default;
    const row = document.createElement('div');
    row.className = 'param-row';
    const valId = `pv-${layer.uid}-${p.id}`;
    row.innerHTML = `
      <div class="param-label">
        <span>${p.label}</span>
        <span class="param-value" id="${valId}">${fmt(val, p.step)}</span>
      </div>
      <input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${val}" />
    `;
    const slider = row.querySelector('input');
    let debounce;
    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      layer.params[p.id] = v;
      document.getElementById(valId).textContent = fmt(v, p.step);
      // update hint in layer list
      const hint = layerList.querySelector(`[data-uid="${layer.uid}"] .layer-param-hint`);
      if (hint) hint.textContent = buildParamHint(filter, layer.params);
      clearTimeout(debounce);
      debounce = setTimeout(applyChain, 50);
    });
    paramPanel.appendChild(row);
  }
}

function fmt(v, step) { return step < 1 ? Number(v).toFixed(2) : String(Math.round(v)); }

// ── Apply chain ────────────────────────────────────────────────────────────
function applyChain() {
  if (!hasImage || !wasm) return;

  if (filterChain.length === 0) {
    outputCanvas.getContext('2d').drawImage(originalCanvas, 0, 0);
    splitOutCanvas.getContext('2d').drawImage(originalCanvas, 0, 0);
    statsBar.innerHTML = '';
    return;
  }

  const src = originalCanvas.getContext('2d').getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  // Single working buffer — mutated in-place by each WASM call
  const work = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);

  const t0 = performance.now();
  for (const layer of filterChain) {
    if (!layer.visible) continue;
    const filter = FILTERS.find((f) => f.id === layer.filterId);
    if (layer.opacity >= 1) {
      filter.apply(wasm, work, layer.params);
    } else {
      const before = new Uint8ClampedArray(work.data);
      filter.apply(wasm, work, layer.params);
      const o = layer.opacity, o1 = 1 - o;
      for (let i = 0; i < work.data.length; i += 4) {
        work.data[i]   = before[i]   * o1 + work.data[i]   * o;
        work.data[i+1] = before[i+1] * o1 + work.data[i+1] * o;
        work.data[i+2] = before[i+2] * o1 + work.data[i+2] * o;
      }
    }
  }
  const elapsed = performance.now() - t0;

  outputCanvas.getContext('2d').putImageData(work, 0, 0);
  splitOutCanvas.getContext('2d').putImageData(work, 0, 0);
  drawHistogram(work);

  const mpxs = (src.width * src.height / elapsed / 1000).toFixed(1);
  statsBar.innerHTML = `
    <div class="stat-card"><span class="stat-label">Thời gian</span><span class="stat-value">${elapsed.toFixed(1)}ms</span></div>
    <div class="stat-card"><span class="stat-label">Kích thước</span><span class="stat-value">${src.width}×${src.height} px</span></div>
    <div class="stat-card"><span class="stat-label">Tốc độ</span><span class="stat-value">${mpxs} Mpx/s</span></div>
    <div class="stat-card"><span class="stat-label">Layers</span><span class="stat-value">${filterChain.length}</span></div>
  `;
}

// ── Histogram ──────────────────────────────────────────────────────────────
const histCanvas = document.getElementById('histogram');
const histCtx = histCanvas.getContext('2d');

function drawHistogram(imageData) {
  const W = histCanvas.width, H = histCanvas.height;
  const r = new Uint32Array(256), g = new Uint32Array(256), b = new Uint32Array(256);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) { r[d[i]]++; g[d[i+1]]++; b[d[i+2]]++; }

  const peak = Math.max(...r, ...g, ...b) || 1;

  histCtx.clearRect(0, 0, W, H);
  histCtx.fillStyle = '#0a0a0f';
  histCtx.fillRect(0, 0, W, H);

  const channels = [
    { data: r, color: 'rgba(239,68,68,0.6)' },
    { data: g, color: 'rgba(34,197,94,0.6)' },
    { data: b, color: 'rgba(79,127,255,0.6)' },
  ];
  for (const ch of channels) {
    histCtx.beginPath();
    histCtx.moveTo(0, H);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * W;
      const y = H - (ch.data[i] / peak) * (H - 2);
      i === 0 ? histCtx.moveTo(x, y) : histCtx.lineTo(x, y);
    }
    histCtx.lineTo(W, H);
    histCtx.closePath();
    histCtx.fillStyle = ch.color;
    histCtx.fill();
  }
}

// ── Action buttons ─────────────────────────────────────────────────────────
btnReset.addEventListener('click', doReset);
btnDownload.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = outputCanvas.toDataURL('image/png');
  a.download = 'lightroom-edited.png';
  a.click();
});
btnSplit.addEventListener('click', toggleSplit);
btnClearChain.addEventListener('click', () => {
  filterChain = [];
  selectedLayerUid = null;
  renderChainUI();
  applyChain();
});

function doReset() {
  filterChain = [];
  selectedLayerUid = null;
  renderChainUI();
  applyChain();
}

function toggleSplit() {
  showSplit = !showSplit;
  btnSplit.childNodes[0].textContent = (showSplit ? 'Tắt Split ' : 'Bật Split ');
  if (showSplit && hasImage) syncSplitSize(originalCanvas.width, originalCanvas.height);
  updateView();
}

// ── Keyboard shortcuts ─────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // Ignore if typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (!hasImage && !['1','2','3','4','5','6','7','8','9','0'].includes(e.key)) return;

  switch (e.key) {
    case '1': case '2': case '3': case '4': case '5':
    case '6': case '7': case '8': case '9': case '0': {
      if (!hasImage) return;
      const idx = e.key === '0' ? 9 : parseInt(e.key) - 1;
      if (FILTERS[idx]) addLayer(FILTERS[idx].id);
      break;
    }
    case '[':
      e.preventDefault();
      selectPrevLayer();
      break;
    case ']':
      e.preventDefault();
      selectNextLayer();
      break;
    case 'Delete':
    case 'Backspace': {
      if (selectedLayerUid !== null) {
        e.preventDefault();
        removeLayer(selectedLayerUid);
      }
      break;
    }
    case 'Escape':
      selectedLayerUid = null;
      renderParamPanel();
      renderLayerListHighlight();
      break;
    case 'r': case 'R':
      doReset();
      break;
    case 's': case 'S':
      if (hasImage) toggleSplit();
      break;
    case '?':
      toggleKeybind();
      break;
    case 'd': case 'D': {
      if (!hasImage) return;
      const a = document.createElement('a');
      a.href = outputCanvas.toDataURL('image/png');
      a.download = 'lightroom-edited.png';
      a.click();
      break;
    }
  }
});

// ── Presets ────────────────────────────────────────────────────────────────
function renderPresets() {
  presetList.innerHTML = '';
  const allPresets = [
    ...BUILTIN_PRESETS.map((p) => ({ ...p, builtin: true })),
    ...loadUserPresets().map((p) => ({ ...p, builtin: false })),
  ];

  for (const preset of allPresets) {
    const item = document.createElement('div');
    item.className = 'preset-item' + (preset.builtin ? ' builtin' : '');
    item.innerHTML = `
      <span class="preset-dot"></span>
      <span class="preset-name">${preset.name}</span>
      <span class="preset-layers">${preset.chain.length} layer${preset.chain.length > 1 ? 's' : ''}</span>
      ${!preset.builtin ? `<button class="preset-delete" data-id="${preset.id}" title="Xóa preset">×</button>` : ''}
    `;

    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('preset-delete')) return;
      if (!hasImage) return;
      filterChain = preset.chain.map(({ filterId, params }) => ({
        uid: nextUid++,
        filterId,
        params: { ...params },
        visible: true,
        opacity: 1,
      }));
      selectedLayerUid = filterChain.length > 0 ? filterChain[filterChain.length - 1].uid : null;
      renderChainUI();
      applyChain();
    });

    if (!preset.builtin) {
      item.querySelector('.preset-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteUserPreset(preset.id);
        renderPresets();
      });
    }

    presetList.appendChild(item);
  }
}

btnSavePreset.addEventListener('click', () => {
  if (filterChain.length === 0) { alert('Chưa có filter nào trong chain.'); return; }
  const name = prompt('Tên preset:', 'My Preset');
  if (!name || !name.trim()) return;
  saveUserPreset(name.trim(), filterChain);
  renderPresets();
});

renderPresets();

// ── View toggle ────────────────────────────────────────────────────────────
function updateView() {
  if (showSplit) {
    bothGrid.style.display = 'none';
    splitContainer.style.display = 'flex';
    applySplitX();
  } else {
    bothGrid.style.display = 'grid';
    splitContainer.style.display = 'none';
  }
}

function applySplitX() {
  splitOrig.style.clipPath = `inset(0 ${100 - splitX}% 0 0)`;
  splitHandle.style.left = `${splitX}%`;
}

function syncSplitSize(w, h) {
  const areaW = splitContainer.clientWidth || 800;
  const areaH = splitContainer.clientHeight || 600;
  const scale = Math.min((areaW - 20) / w, (areaH - 20) / h, 1);
  splitInner.style.width = `${Math.round(w * scale)}px`;
  splitInner.style.height = `${Math.round(h * scale)}px`;
}

// ── Keybind popup ─────────────────────────────────────────────────────────
const keybindOverlay = document.getElementById('keybind-overlay');
const btnKeybind = document.getElementById('btn-keybind');
const btnKbClose = document.getElementById('kb-close');

function toggleKeybind() {
  const visible = keybindOverlay.style.display !== 'none';
  keybindOverlay.style.display = visible ? 'none' : 'flex';
}

btnKeybind.addEventListener('click', toggleKeybind);
btnKbClose.addEventListener('click', toggleKeybind);
keybindOverlay.addEventListener('click', (e) => { if (e.target === keybindOverlay) toggleKeybind(); });

// ── Mobile panel toggle ────────────────────────────────────────────────────
const btnMobilePanel = document.getElementById('btn-mobile-panel');
const aside = document.querySelector('aside');

btnMobilePanel.addEventListener('click', () => {
  aside.classList.toggle('mobile-collapsed');
});

// ── Split drag ─────────────────────────────────────────────────────────────
const splitHandle = document.getElementById('split-handle');

splitHandle.addEventListener('mousedown', (e) => { splitDragging = true; e.preventDefault(); });
document.addEventListener('mouseup', () => { splitDragging = false; });
document.addEventListener('mousemove', (e) => {
  if (!splitDragging) return;
  const rect = splitInner.getBoundingClientRect();
  splitX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
  applySplitX();
});
splitHandle.addEventListener('touchstart', (e) => { splitDragging = true; e.preventDefault(); }, { passive: false });
document.addEventListener('touchend', () => { splitDragging = false; });
document.addEventListener('touchmove', (e) => {
  if (!splitDragging) return;
  const rect = splitInner.getBoundingClientRect();
  splitX = Math.max(5, Math.min(95, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
  applySplitX();
}, { passive: true });
