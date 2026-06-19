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

// Temperature: value -1.0 (cool/blue) to 1.0 (warm/yellow)
#[wasm_bindgen]
pub fn temperature(data: &mut [u8], value: f32) {
    let v = value.clamp(-1.0, 1.0) * 60.0;
    for px in data.chunks_mut(4) {
        px[0] = (px[0] as f32 + v).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 - v).clamp(0.0, 255.0) as u8;
    }
}

// Tint: value -1.0 (green) to 1.0 (magenta)
#[wasm_bindgen]
pub fn tint(data: &mut [u8], value: f32) {
    let v = value.clamp(-1.0, 1.0) * 40.0;
    for px in data.chunks_mut(4) {
        px[1] = (px[1] as f32 - v).clamp(0.0, 255.0) as u8;
        px[0] = (px[0] as f32 + v * 0.3).clamp(0.0, 255.0) as u8;
        px[2] = (px[2] as f32 + v * 0.3).clamp(0.0, 255.0) as u8;
    }
}

// Clarity: local contrast in midtones. amount -1.0 to 1.0
#[wasm_bindgen]
pub fn clarity(data: &mut [u8], width: u32, height: u32, amount: f32) {
    let w = width as usize;
    let h = height as usize;
    let a = amount.clamp(-1.0, 1.0);
    let blurred = box_blur_copy(data, w, h, 5);
    for (i, px) in data.chunks_mut(4).enumerate() {
        let lum = luma(px[0], px[1], px[2]) / 255.0;
        let mid_w = 4.0 * lum * (1.0 - lum);
        let blend = a * mid_w;
        for c in 0..3 {
            let orig = px[c] as f32;
            let blr = blurred[i * 4 + c] as f32;
            px[c] = (orig + blend * (orig - blr)).clamp(0.0, 255.0) as u8;
        }
    }
}

// Dehaze: positive removes haze, negative adds haze/fog
#[wasm_bindgen]
pub fn dehaze(data: &mut [u8], amount: f32) {
    let a = amount.clamp(-1.0, 1.0);
    for px in data.chunks_mut(4) {
        for c in 0..3 {
            let v = px[c] as f32 / 255.0;
            let result = if a >= 0.0 {
                v.powf(1.0 + a * 0.8)
            } else {
                v + (-a) * 0.4 * (1.0 - v)
            };
            px[c] = (result.clamp(0.0, 1.0) * 255.0) as u8;
        }
    }
}

// HSL per-color: 8 ranges (R/O/Y/G/Aqua/B/P/M), each with hue shift (deg), sat delta (-100..100), lum delta (-100..100)
#[wasm_bindgen]
#[allow(clippy::too_many_arguments)]
pub fn hsl_adjust(data: &mut [u8],
    r_h: f32, r_s: f32, r_l: f32,
    o_h: f32, o_s: f32, o_l: f32,
    y_h: f32, y_s: f32, y_l: f32,
    g_h: f32, g_s: f32, g_l: f32,
    a_h: f32, a_s: f32, a_l: f32,
    b_h: f32, b_s: f32, b_l: f32,
    p_h: f32, p_s: f32, p_l: f32,
    m_h: f32, m_s: f32, m_l: f32,
) {
    const CENTERS: [f32; 8] = [
        0.0/360.0, 30.0/360.0, 60.0/360.0, 120.0/360.0,
        180.0/360.0, 240.0/360.0, 270.0/360.0, 315.0/360.0,
    ];
    let hd = [r_h/360.0, o_h/360.0, y_h/360.0, g_h/360.0, a_h/360.0, b_h/360.0, p_h/360.0, m_h/360.0];
    let sd = [r_s/100.0, o_s/100.0, y_s/100.0, g_s/100.0, a_s/100.0, b_s/100.0, p_s/100.0, m_s/100.0];
    let ld = [r_l/100.0, o_l/100.0, y_l/100.0, g_l/100.0, a_l/100.0, b_l/100.0, p_l/100.0, m_l/100.0];

    for px in data.chunks_mut(4) {
        let (h, s, l) = rgb_to_hsl(px[0], px[1], px[2]);
        let mut dh = 0.0f32;
        let mut ds = 0.0f32;
        let mut dl = 0.0f32;
        for i in 0..8 {
            let mut diff = (h - CENTERS[i]).abs();
            if diff > 0.5 { diff = 1.0 - diff; }
            let range = 1.0 / 8.0;
            if diff < range {
                let w = (1.0 - diff / range) * s; // weight by saturation so gray pixels unaffected
                dh += w * hd[i];
                ds += w * sd[i];
                dl += w * ld[i];
            }
        }
        let (r, g, b) = hsl_to_rgb(
            (h + dh).rem_euclid(1.0),
            (s + ds).clamp(0.0, 1.0),
            (l + dl).clamp(0.0, 1.0),
        );
        px[0] = r; px[1] = g; px[2] = b;
    }
}

// Apply a 256-entry LUT to each RGB channel (identical LUT for all 3)
#[wasm_bindgen]
pub fn apply_lut(data: &mut [u8], lut: &[u8]) {
    if lut.len() < 256 { return; }
    for px in data.chunks_mut(4) {
        px[0] = lut[px[0] as usize];
        px[1] = lut[px[1] as usize];
        px[2] = lut[px[2] as usize];
    }
}

fn box_blur_copy(data: &[u8], w: usize, h: usize, radius: usize) -> Vec<u8> {
    let mut tmp = data.to_vec();
    let mut out = data.to_vec();
    // horizontal
    for y in 0..h {
        for x in 0..w {
            let x0 = x.saturating_sub(radius);
            let x1 = (x + radius).min(w - 1);
            let n = (x1 - x0 + 1) as f32;
            let (mut r, mut g, mut b) = (0.0f32, 0.0f32, 0.0f32);
            for xx in x0..=x1 {
                let idx = (y * w + xx) * 4;
                r += data[idx] as f32; g += data[idx+1] as f32; b += data[idx+2] as f32;
            }
            let idx = (y * w + x) * 4;
            tmp[idx] = (r/n) as u8; tmp[idx+1] = (g/n) as u8; tmp[idx+2] = (b/n) as u8;
        }
    }
    // vertical
    for y in 0..h {
        for x in 0..w {
            let y0 = y.saturating_sub(radius);
            let y1 = (y + radius).min(h - 1);
            let n = (y1 - y0 + 1) as f32;
            let (mut r, mut g, mut b) = (0.0f32, 0.0f32, 0.0f32);
            for yy in y0..=y1 {
                let idx = (yy * w + x) * 4;
                r += tmp[idx] as f32; g += tmp[idx+1] as f32; b += tmp[idx+2] as f32;
            }
            let idx = (y * w + x) * 4;
            out[idx] = (r/n) as u8; out[idx+1] = (g/n) as u8; out[idx+2] = (b/n) as u8;
        }
    }
    out
}

// Color grade: tint + lighten/darken shadows/midtones/highlights independently
// hue: 0–360; sat: 0–1; lum: -1 (darken) to 1 (brighten)
#[wasm_bindgen]
pub fn color_grade(
    data: &mut [u8],
    shadow_hue: f32, shadow_sat: f32, shadow_lum: f32,
    mid_hue: f32,    mid_sat: f32,    mid_lum: f32,
    hi_hue: f32,     hi_sat: f32,     hi_lum: f32,
) {
    // Convert each zone hue to a pure-saturation RGB color (L=0.5 in HSL)
    let (sr, sg, sb) = hsl_to_rgb(shadow_hue / 360.0, 1.0, 0.5);
    let (mr, mg, mb) = hsl_to_rgb(mid_hue    / 360.0, 1.0, 0.5);
    let (hr, hg, hb) = hsl_to_rgb(hi_hue     / 360.0, 1.0, 0.5);
    let (sr, sg, sb) = (sr as f32 / 255.0, sg as f32 / 255.0, sb as f32 / 255.0);
    let (mr, mg, mb) = (mr as f32 / 255.0, mg as f32 / 255.0, mb as f32 / 255.0);
    let (hr, hg, hb) = (hr as f32 / 255.0, hg as f32 / 255.0, hb as f32 / 255.0);

    let ss = shadow_sat.clamp(0.0, 1.0) * 0.35;
    let ms = mid_sat.clamp(0.0, 1.0)    * 0.35;
    let hs = hi_sat.clamp(0.0, 1.0)     * 0.35;

    for px in data.chunks_mut(4) {
        let r = px[0] as f32 / 255.0;
        let g = px[1] as f32 / 255.0;
        let b = px[2] as f32 / 255.0;
        let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // Luminance-based zone weights (sum ≈ 1 at any lum)
        let w_s = (1.0 - lum).powi(2);
        let w_h = lum.powi(2);
        let w_m = 4.0 * lum * (1.0 - lum);

        // Weighted tint color
        let tr = w_s * sr * ss + w_m * mr * ms + w_h * hr * hs;
        let tg = w_s * sg * ss + w_m * mg * ms + w_h * hg * hs;
        let tb = w_s * sb * ss + w_m * mb * ms + w_h * hb * hs;

        // Screen blend for tint, then zone-weighted luminance offset
        let lum_adj = (w_s * shadow_lum + w_m * mid_lum + w_h * hi_lum).clamp(-1.0, 1.0) * 0.5;
        px[0] = ((r + tr - r * tr + lum_adj).clamp(0.0, 1.0) * 255.0) as u8;
        px[1] = ((g + tg - g * tg + lum_adj).clamp(0.0, 1.0) * 255.0) as u8;
        px[2] = ((b + tb - b * tb + lum_adj).clamp(0.0, 1.0) * 255.0) as u8;
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
