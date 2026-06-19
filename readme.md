# WASM Image Editor — Next.js Implementation

## Tổng quan

Ứng dụng chỉnh ảnh chạy hoàn toàn trên trình duyệt, xử lý pixel bằng WebAssembly (Rust) để đạt hiệu năng cao. Không upload ảnh lên server — mọi thứ xử lý local.

## Stack

- **Framework**: Next.js 14+ (App Router)
- **WASM**: Rust + wasm-pack + wasm-bindgen
- **UI**: Tailwind CSS
- **Language**: TypeScript

---

## Cấu trúc thư mục

```
wasm-image-editor/
├── wasm-src/                      # Rust source
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
├── public/
│   └── wasm/                      # Output của wasm-pack (tự sinh)
│       ├── img_wasm.js
│       ├── img_wasm.wasm
│       └── img_wasm.d.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ImageEditor.tsx        # Component chính
│   │   ├── UploadZone.tsx         # Drag & drop upload
│   │   ├── FilterPanel.tsx        # Danh sách filter + sliders
│   │   ├── PreviewCanvas.tsx      # Canvas gốc + canvas output
│   │   └── StatsBar.tsx           # Hiển thị thời gian xử lý
│   └── lib/
│       ├── wasmLoader.ts          # Init & singleton WASM instance
│       └── filters.ts             # Wrapper các hàm filter
├── next.config.js
└── package.json
```

---

## Rust WASM — `wasm-src/src/lib.rs`

Implement đầy đủ các hàm sau, export qua `#[wasm_bindgen]`:

```rust
use wasm_bindgen::prelude::*;

// 1. Grayscale — công thức luminance chuẩn
pub fn grayscale(data: &mut [u8], intensity: f32)

// 2. Invert màu
pub fn invert(data: &mut [u8], intensity: f32)

// 3. Sepia tone
pub fn sepia(data: &mut [u8], intensity: f32)

// 4. Brightness — range [-255, 255]
pub fn brightness(data: &mut [u8], value: f32)

// 5. Contrast — factor nhân quanh 128
pub fn contrast(data: &mut [u8], factor: f32)

// 6. Box blur — nested loop, radius 1–10
pub fn box_blur(data: &mut [u8], width: u32, height: u32, radius: u32)

// 7. Sobel edge detection
pub fn edge_detect(data: &mut [u8], width: u32, height: u32, sensitivity: f32)

// 8. Threshold (binary)
pub fn threshold(data: &mut [u8], value: u8)

// 9. Sharpen — convolution kernel 3x3
pub fn sharpen(data: &mut [u8], width: u32, height: u32, amount: f32)

// 10. Hue rotate — chuyển RGB → HSL → xoay hue → RGB
pub fn hue_rotate(data: &mut [u8], degrees: f32)
```

`Cargo.toml` cần:
```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

Build command: `wasm-pack build --target web --out-dir ../public/wasm`

---

## `next.config.js`

```js
const nextConfig = {
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;
```

---

## `src/lib/wasmLoader.ts`

- Singleton pattern — chỉ init WASM một lần
- Fetch từ `/wasm/img_wasm.wasm`
- Export `getWasm(): Promise<WasmExports>`
- Guard `typeof window === 'undefined'` để không chạy khi SSR

```ts
interface WasmExports {
  grayscale(data: Uint8Array, intensity: number): void;
  invert(data: Uint8Array, intensity: number): void;
  sepia(data: Uint8Array, intensity: number): void;
  brightness(data: Uint8Array, value: number): void;
  contrast(data: Uint8Array, factor: number): void;
  box_blur(data: Uint8Array, width: number, height: number, radius: number): void;
  edge_detect(data: Uint8Array, width: number, height: number, sensitivity: number): void;
  threshold(data: Uint8Array, value: number): void;
  sharpen(data: Uint8Array, width: number, height: number, amount: number): void;
  hue_rotate(data: Uint8Array, degrees: number): void;
}
```

---

## `src/lib/filters.ts`

Mỗi filter là một object:

```ts
export interface Filter {
  id: string;
  name: string;
  params: FilterParam[];
  apply: (wasm: WasmExports, data: ImageData) => void;
}

export interface FilterParam {
  id: string;
  label: string;
  min: number;
  max: number;
  default: number;
  step: number;
}
```

Danh sách 10 filter, mỗi cái map 1–2 slider vào hàm WASM tương ứng.

---

## Components

### `UploadZone.tsx`

- Drag & drop + click to browse
- Chấp nhận: `image/jpeg`, `image/png`, `image/webp`
- Giới hạn kích thước: 20MB
- Sau khi chọn file: đọc bằng `FileReader` → tạo `<img>` → vẽ lên canvas gốc
- Resize về max 1200px chiều dài (giữ tỉ lệ) trước khi vẽ
- Hiển thị tên file + kích thước

### `PreviewCanvas.tsx`

Props:
```ts
interface PreviewCanvasProps {
  originalRef: React.RefObject<HTMLCanvasElement>;
  outputRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  showSplit: boolean; // chế độ split view
}
```

- Hai canvas đặt cạnh nhau (grid 2 cột)
- Nút toggle **Split view**: kéo thanh giữa để so sánh before/after (dùng `mousemove` + clip-path)
- Label "Gốc" và "Đã chỉnh" ở góc trên mỗi canvas

### `FilterPanel.tsx`

Props:
```ts
interface FilterPanelProps {
  filters: Filter[];
  activeFilter: string | null;
  params: Record<string, number>;
  onSelectFilter: (id: string) => void;
  onParamChange: (filterId: string, paramId: string, value: number) => void;
  processing: boolean;
}
```

- Grid các nút filter (2 cột)
- Khi chọn filter: hiện slider(s) tương ứng ngay bên dưới
- Slider debounce 50ms trước khi gọi WASM (dùng `useCallback` + `setTimeout`)

### `StatsBar.tsx`

Hiển thị 3 metric cards:
- **Thời gian xử lý**: `X.Xms`
- **Kích thước ảnh**: `WxH px`
- **Tốc độ**: `X.X Mpx/s` (= width×height / time_ms / 1000)

### `ImageEditor.tsx` — Component chính

State:
```ts
const [hasImage, setHasImage] = useState(false);
const [activeFilter, setActiveFilter] = useState<string | null>(null);
const [params, setParams] = useState<Record<string, number>>({});
const [processing, setProcessing] = useState(false);
const [stats, setStats] = useState<Stats | null>(null);
const [showSplit, setShowSplit] = useState(false);
const originalRef = useRef<HTMLCanvasElement>(null);
const outputRef = useRef<HTMLCanvasElement>(null);
```

Logic xử lý:
1. Khi `activeFilter` hoặc `params` thay đổi → gọi `applyCurrentFilter()`
2. `applyCurrentFilter`:
   - Lấy ImageData từ `originalRef`
   - Copy sang buffer mới (không mutate canvas gốc)
   - `const t0 = performance.now()`
   - Gọi hàm WASM tương ứng
   - `const t1 = performance.now()`
   - `putImageData` lên `outputRef`
   - Update stats
3. Nút **Reset**: copy canvas gốc sang output, clear filter selection
4. Nút **Download**: `outputRef.toDataURL('image/png')` → tạo `<a>` download

---

## `package.json` scripts

```json
{
  "scripts": {
    "build:wasm": "cd wasm-src && wasm-pack build --target web --out-dir ../public/wasm",
    "dev": "npm run build:wasm && next dev",
    "build": "npm run build:wasm && next build",
    "start": "next start"
  }
}
```

---

## UI / UX

- **Layout**: sidebar trái (FilterPanel, 280px) + vùng canvas phải (flex-grow)
- **Theme**: dark mode mặc định, Tailwind class `dark:`
- **Responsive**: trên mobile (< 768px) sidebar chuyển xuống dưới canvas
- **Loading state**: khi WASM đang init, hiển thị skeleton + "Đang tải bộ xử lý..."
- **Error state**: nếu WASM load thất bại, hiện fallback chạy bằng JS thuần (copy y hệt logic nhưng không import WASM)

---

## Yêu cầu kỹ thuật

- `'use client'` trên tất cả component có canvas hoặc WASM
- Không gọi WASM trong Server Component hay `getServerSideProps`
- `useEffect` để init WASM sau khi mount
- Mỗi lần apply filter phải tạo `ImageData` mới từ canvas gốc — không stack filter lên nhau (trừ khi có nút "Apply & keep")
- Canvas gốc không bao giờ bị ghi đè

---

## Deliverables

Claude Code cần tạo đủ các file sau:

1. `wasm-src/Cargo.toml`
2. `wasm-src/src/lib.rs` — 10 filter functions
3. `next.config.js`
4. `src/app/layout.tsx`
5. `src/app/page.tsx`
6. `src/lib/wasmLoader.ts`
7. `src/lib/filters.ts`
8. `src/components/ImageEditor.tsx`
9. `src/components/UploadZone.tsx`
10. `src/components/FilterPanel.tsx`
11. `src/components/PreviewCanvas.tsx`
12. `src/components/StatsBar.tsx`
13. `package.json`
14. `tsconfig.json`

Sau khi tạo xong file, chạy:
```bash
npm install
npm run build:wasm
npm run dev
```

Nếu `wasm-pack` chưa cài: `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`