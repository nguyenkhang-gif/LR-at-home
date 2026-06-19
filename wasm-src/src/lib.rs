use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn grayscale(data: &mut [u8], intensity: f32) {
    let i = intensity.clamp(0.0, 1.0);
    for px in data.chunks_mut(4) {
        let lum = luma(px[0], px[1], px[2]) as u8;
        px[0] = lerp_u8(px[0], lum, i);
        px[1] = lerp_u8(px[1], lum, i);
        px[2] = lerp_u8(px[2], lum, i);
    }
}

#[wasm_bindgen]
pub fn invert(data: &mut [u8], intensity: f32) {
    let i = intensity.clamp(0.0, 1.0);
    for px in data.chunks_mut(4) {
        px[0] = lerp_u8(px[0], 255 - px[0], i);
        px[1] = lerp_u8(px[1], 255 - px[1], i);
        px[2] = lerp_u8(px[2], 255 - px[2], i);
    }
}

#[wasm_bindgen]
pub fn sepia(data: &mut [u8], intensity: f32) {
    let i = intensity.clamp(0.0, 1.0);
    for px in data.chunks_mut(4) {
        let r = px[0] as f32;
        let g = px[1] as f32;
        let b = px[2] as f32;
        let sr = (r * 0.393 + g * 0.769 + b * 0.189).min(255.0) as u8;
        let sg = (r * 0.349 + g * 0.686 + b * 0.168).min(255.0) as u8;
        let sb = (r * 0.272 + g * 0.534 + b * 0.131).min(255.0) as u8;
        px[0] = lerp_u8(px[0], sr, i);
        px[1] = lerp_u8(px[1], sg, i);
        px[2] = lerp_u8(px[2], sb, i);
    }
}

#[wasm_bindgen]
pub fn brightness(data: &mut [u8], value: f32) {
    let v = value.clamp(-255.0, 255.0);
    for px in data.chunks_mut(4) {
        px[0] = (px[0] as f32 + v).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 + v).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + v).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn highlights(data: &mut [u8], value: f32) {
    let v = value.clamp(-1.0, 1.0) * 128.0;
    for px in data.chunks_mut(4) {
        let lum = luma(px[0], px[1], px[2]);
        let w = (lum / 255.0) * (lum / 255.0); // quadratic: bright pixels get full weight
        let adj = v * w;
        px[0] = (px[0] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + adj).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn shadows(data: &mut [u8], value: f32) {
    let v = value.clamp(-1.0, 1.0) * 128.0;
    for px in data.chunks_mut(4) {
        let lum = luma(px[0], px[1], px[2]);
        let w = (1.0 - lum / 255.0) * (1.0 - lum / 255.0); // dark pixels get full weight
        let adj = v * w;
        px[0] = (px[0] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + adj).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn whites(data: &mut [u8], value: f32) {
    let v = value.clamp(-1.0, 1.0) * 100.0;
    for px in data.chunks_mut(4) {
        let lum = luma(px[0], px[1], px[2]);
        let t = lum / 255.0;
        let w = t * t * t; // cubic: only very bright pixels
        let adj = v * w;
        px[0] = (px[0] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + adj).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn blacks(data: &mut [u8], value: f32) {
    let v = value.clamp(-1.0, 1.0) * 100.0;
    for px in data.chunks_mut(4) {
        let lum = luma(px[0], px[1], px[2]);
        let t = 1.0 - lum / 255.0;
        let w = t * t * t; // cubic: only very dark pixels
        let adj = v * w;
        px[0] = (px[0] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 + adj).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + adj).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn exposure(data: &mut [u8], stops: f32) {
    let factor = (2.0f32).powf(stops.clamp(-5.0, 5.0));
    for px in data.chunks_mut(4) {
        px[0] = (px[0] as f32 * factor).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 * factor).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 * factor).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn contrast(data: &mut [u8], factor: f32) {
    for px in data.chunks_mut(4) {
        px[0] = ((factor * (px[0] as f32 - 128.0)) + 128.0).clamp(0.0, 255.0) as u8;
        px[1] = ((factor * (px[1] as f32 - 128.0)) + 128.0).clamp(0.0, 255.0) as u8;
        px[2] = ((factor * (px[2] as f32 - 128.0)) + 128.0).clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen]
pub fn box_blur(data: &mut [u8], width: u32, height: u32, radius: u32) {
    let w = width as usize;
    let h = height as usize;
    let r = (radius as usize).min(10).max(1);
    let src = data.to_vec();

    for y in 0..h {
        for x in 0..w {
            let mut sum_r = 0u32;
            let mut sum_g = 0u32;
            let mut sum_b = 0u32;
            let mut count = 0u32;

            let y0 = y.saturating_sub(r);
            let y1 = (y + r + 1).min(h);
            let x0 = x.saturating_sub(r);
            let x1 = (x + r + 1).min(w);

            for ky in y0..y1 {
                for kx in x0..x1 {
                    let idx = (ky * w + kx) * 4;
                    sum_r += src[idx] as u32;
                    sum_g += src[idx + 1] as u32;
                    sum_b += src[idx + 2] as u32;
                    count += 1;
                }
            }

            let idx = (y * w + x) * 4;
            data[idx] = (sum_r / count) as u8;
            data[idx + 1] = (sum_g / count) as u8;
            data[idx + 2] = (sum_b / count) as u8;
        }
    }
}

#[wasm_bindgen]
pub fn edge_detect(data: &mut [u8], width: u32, height: u32, sensitivity: f32) {
    let w = width as usize;
    let h = height as usize;
    let src = data.to_vec();

    let kx: [f32; 9] = [-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0];
    let ky: [f32; 9] = [-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0];

    for y in 1..h - 1 {
        for x in 1..w - 1 {
            let mut gx = 0.0f32;
            let mut gy = 0.0f32;
            for ky_off in 0..3usize {
                for kx_off in 0..3usize {
                    let px_y = y + ky_off - 1;
                    let px_x = x + kx_off - 1;
                    let idx = (px_y * w + px_x) * 4;
                    let lum = luma(src[idx], src[idx + 1], src[idx + 2]);
                    let k = ky_off * 3 + kx_off;
                    gx += kx[k] * lum;
                    gy += ky[k] * lum;
                }
            }
            let mag = ((gx * gx + gy * gy).sqrt() * sensitivity).clamp(0.0, 255.0) as u8;
            let idx = (y * w + x) * 4;
            data[idx] = mag;
            data[idx + 1] = mag;
            data[idx + 2] = mag;
        }
    }
}

#[wasm_bindgen]
pub fn threshold(data: &mut [u8], value: u8) {
    for px in data.chunks_mut(4) {
        let lum = luma(px[0], px[1], px[2]) as u8;
        let v = if lum >= value { 255 } else { 0 };
        px[0] = v;
        px[1] = v;
        px[2] = v;
    }
}

#[wasm_bindgen]
pub fn sharpen(data: &mut [u8], width: u32, height: u32, amount: f32) {
    let w = width as usize;
    let h = height as usize;
    let src = data.to_vec();
    let a = amount;
    let center = 1.0 + 4.0 * a;
    let side = -a;

    for y in 1..h - 1 {
        for x in 1..w - 1 {
            let idx = (y * w + x) * 4;
            for c in 0..3 {
                let v = center * src[idx + c] as f32
                    + side * src[((y - 1) * w + x) * 4 + c] as f32
                    + side * src[((y + 1) * w + x) * 4 + c] as f32
                    + side * src[(y * w + x - 1) * 4 + c] as f32
                    + side * src[(y * w + x + 1) * 4 + c] as f32;
                data[idx + c] = v.clamp(0.0, 255.0) as u8;
            }
        }
    }
}

#[wasm_bindgen]
pub fn saturation(data: &mut [u8], factor: f32) {
    let f = factor.clamp(0.0, 3.0);
    for px in data.chunks_mut(4) {
        let (h, s, l) = rgb_to_hsl(px[0], px[1], px[2]);
        let (r, g, b) = hsl_to_rgb(h, (s * f).clamp(0.0, 1.0), l);
        px[0] = r;
        px[1] = g;
        px[2] = b;
    }
}

#[wasm_bindgen]
pub fn hue_rotate(data: &mut [u8], degrees: f32) {
    for px in data.chunks_mut(4) {
        let (h, s, l) = rgb_to_hsl(px[0], px[1], px[2]);
        let new_h = (h + degrees / 360.0).rem_euclid(1.0);
        let (r, g, b) = hsl_to_rgb(new_h, s, l);
        px[0] = r;
        px[1] = g;
        px[2] = b;
    }
}

#[wasm_bindgen]
pub fn vignette(data: &mut [u8], width: u32, height: u32, strength: f32) {
    let w = width as usize;
    let h = height as usize;
    let cx = w as f32 / 2.0;
    let cy = h as f32 / 2.0;
    let max_dist = (cx * cx + cy * cy).sqrt();
    let s = strength.clamp(0.0, 1.0);

    for y in 0..h {
        for x in 0..w {
            let dx = x as f32 - cx;
            let dy = y as f32 - cy;
            let dist = (dx * dx + dy * dy).sqrt() / max_dist;
            let factor = 1.0 - s * dist * dist;
            let idx = (y * w + x) * 4;
            data[idx]     = (data[idx]     as f32 * factor).clamp(0.0, 255.0) as u8;
            data[idx + 1] = (data[idx + 1] as f32 * factor).clamp(0.0, 255.0) as u8;
            data[idx + 2] = (data[idx + 2] as f32 * factor).clamp(0.0, 255.0) as u8;
        }
    }
}

#[wasm_bindgen]
pub fn grain(data: &mut [u8], amount: f32) {
    let a = amount.clamp(0.0, 1.0) * 128.0;
    for (i, px) in data.chunks_mut(4).enumerate() {
        let noise = (hash(i as u32) as f32 / 127.5 - 1.0) * a;
        px[0] = (px[0] as f32 + noise).clamp(0.0, 255.0) as u8;
        px[1] = (px[1] as f32 + noise).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + noise).clamp(0.0, 255.0) as u8;
    }
}

fn hash(mut x: u32) -> u8 {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    (x & 0xFF) as u8
}

fn luma(r: u8, g: u8, b: u8) -> f32 {
    0.2126 * r as f32 + 0.7152 * g as f32 + 0.0722 * b as f32
}

fn lerp_u8(a: u8, b: u8, t: f32) -> u8 {
    (a as f32 + (b as f32 - a as f32) * t).clamp(0.0, 255.0) as u8
}

fn rgb_to_hsl(r: u8, g: u8, b: u8) -> (f32, f32, f32) {
    let r = r as f32 / 255.0;
    let g = g as f32 / 255.0;
    let b = b as f32 / 255.0;
    let max = r.max(g).max(b);
    let min = r.min(g).min(b);
    let l = (max + min) / 2.0;
    if (max - min).abs() < f32::EPSILON {
        return (0.0, 0.0, l);
    }
    let d = max - min;
    let s = if l > 0.5 { d / (2.0 - max - min) } else { d / (max + min) };
    let h = if max == r {
        ((g - b) / d + if g < b { 6.0 } else { 0.0 }) / 6.0
    } else if max == g {
        ((b - r) / d + 2.0) / 6.0
    } else {
        ((r - g) / d + 4.0) / 6.0
    };
    (h, s, l)
}

fn hsl_to_rgb(h: f32, s: f32, l: f32) -> (u8, u8, u8) {
    if s < f32::EPSILON {
        let v = (l * 255.0) as u8;
        return (v, v, v);
    }
    let q = if l < 0.5 { l * (1.0 + s) } else { l + s - l * s };
    let p = 2.0 * l - q;
    let r = hue_to_rgb(p, q, h + 1.0 / 3.0);
    let g = hue_to_rgb(p, q, h);
    let b = hue_to_rgb(p, q, h - 1.0 / 3.0);
    ((r * 255.0) as u8, (g * 255.0) as u8, (b * 255.0) as u8)
}

fn hue_to_rgb(p: f32, q: f32, mut t: f32) -> f32 {
    if t < 0.0 { t += 1.0; }
    if t > 1.0 { t -= 1.0; }
    if t < 1.0 / 6.0 { return p + (q - p) * 6.0 * t; }
    if t < 1.0 / 2.0 { return q; }
    if t < 2.0 / 3.0 { return p + (q - p) * (2.0 / 3.0 - t) * 6.0; }
    p
}
