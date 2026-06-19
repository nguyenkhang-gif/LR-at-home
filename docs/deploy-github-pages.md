# Deploy lên GitHub Pages

## Trước khi deploy — fix đường dẫn WASM

Sửa `js/wasmLoader.js`, đổi từ absolute sang relative path:

```js
// Dòng này:
const mod = await import('../public/wasm/img_wasm.js');

// Thành:
const base = import.meta.url.replace(/\/js\/wasmLoader\.js$/, '');
const mod = await import(/* @vite-ignore */ `${base}/public/wasm/img_wasm.js`);
```

Hoặc đơn giản hơn — dùng relative import trực tiếp:
```js
const mod = await import('./public/wasm/img_wasm.js');
```

> **Lý do**: GitHub Pages serve app tại `/lightroomathome/` (subfolder),
> đường dẫn tuyệt đối `/public/wasm/...` sẽ trỏ sai.

---

## Bước 1 — Build WASM

```bash
cd lightroomathome/wasm-src
wasm-pack build --target web --out-dir ../public/wasm
```

Kiểm tra output:
```
public/wasm/
  ├── img_wasm.js
  ├── img_wasm_bg.wasm
  ├── img_wasm.d.ts
  └── img_wasm_bg.wasm.d.ts
```

---

## Bước 2 — Tạo .gitignore

Tạo file `lightroomathome/.gitignore`:

```
node_modules/
wasm-src/target/
```

> **Quan trọng**: KHÔNG ignore `public/wasm/` — GitHub Pages cần các file này.
> Rust/wasm-pack không có sẵn trên GitHub Actions free tier nên phải commit binary.

---

## Bước 3 — Init git và push

```bash
cd lightroomathome

git init
git add .
git commit -m "feat: lightroom at home - wasm image editor"

# Tạo repo trên GitHub trước, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/lightroomathome.git
git branch -M main
git push -u origin main
```

---

## Bước 4 — Bật GitHub Pages

1. Vào repo trên GitHub
2. **Settings** → **Pages** (sidebar trái)
3. Source: **Deploy from a branch**
4. Branch: `main` / Folder: `/ (root)`
5. Click **Save**

Chờ ~1–2 phút, GitHub sẽ hiển thị URL:
```
https://YOUR_USERNAME.github.io/lightroomathome/
```

---

## Kiểm tra sau khi deploy

Mở DevTools (F12) → Console, không được có lỗi dạng:
- `Failed to fetch` → đường dẫn WASM sai
- `MIME type mismatch` → GitHub Pages đã tự handle đúng, không cần lo

---

## Cập nhật sau này

Mỗi khi sửa code:

```bash
# Nếu sửa Rust:
cd wasm-src && wasm-pack build --target web --out-dir ../public/wasm && cd ..

# Commit và push:
git add .
git commit -m "update: ..."
git push
```

GitHub Pages tự deploy lại sau ~1 phút.
