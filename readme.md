# Lightroom At Home

🔗 **Live demo**: https://nguyenkhang-gif.github.io/LR-at-home/

Ứng dụng chỉnh ảnh chạy hoàn toàn trên trình duyệt — không upload ảnh lên server, mọi thứ xử lý local bằng WebAssembly.

---

## Tính năng

**Ánh sáng**
- Exposure (stop-based, mô phỏng sensor máy ảnh thật)
- Highlights / Shadows (luminance-weighted, chỉ tác động vùng sáng/tối)
- Whites / Blacks (điều chỉnh điểm trắng/đen)
- Brightness, Contrast

**Màu sắc**
- Grayscale, Sepia, Invert
- Saturation, Hue Rotate

**Chi tiết**
- Sharpen, Box Blur

**Hiệu ứng**
- Vignette, Film Grain

**Workflow**
- Filter chain — chồng nhiều filter, kéo để sắp xếp lại thứ tự
- Layer visibility toggle + opacity riêng cho từng layer
- Presets (5 built-in + lưu preset của riêng bạn vào localStorage)
- Split view before/after
- Histogram RGB realtime
- Keyboard shortcuts

---

## Keyboard shortcuts

| Phím | Hành động |
|---|---|
| `1`–`0` | Thêm filter theo thứ tự |
| `[` / `]` | Chọn layer trước / sau |
| `Del` | Xóa layer đang chọn |
| `S` | Toggle split view |
| `R` | Reset toàn bộ |
| `D` | Download PNG |

---

## Stack

- **Vanilla HTML + CSS + JS** — không framework, không bundler
- **Rust → WASM** — xử lý pixel, compile bằng `wasm-pack`
- **GitHub Pages** — deploy tĩnh, miễn phí

---

## Chạy local

```bash
# Cần có Rust + wasm-pack
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Build WASM
cd wasm-src
wasm-pack build --target web --out-dir ../public/wasm

# Serve (cần static server vì ES Modules)
cd ..
npx serve .
```

Mở `http://localhost:3000`

---

## Cấu trúc

```
├── index.html
├── style.css
├── js/
│   ├── app.js          # Logic chính, filter chain, keyboard
│   ├── filters.js      # Định nghĩa 17 filter + params
│   ├── presets.js      # Built-in presets + localStorage
│   └── wasmLoader.js   # Singleton WASM loader
├── wasm-src/
│   └── src/lib.rs      # Rust — tất cả filter functions
└── public/
    └── wasm/           # Output wasm-pack (commit cùng repo)
```
