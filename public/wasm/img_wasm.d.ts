/* tslint:disable */
/* eslint-disable */

export function blacks(data: Uint8Array, value: number): void;

export function box_blur(data: Uint8Array, width: number, height: number, radius: number): void;

export function brightness(data: Uint8Array, value: number): void;

export function clarity(data: Uint8Array, width: number, height: number, amount: number): void;

export function color_grade(data: Uint8Array, shadow_hue: number, shadow_sat: number, mid_hue: number, mid_sat: number, hi_hue: number, hi_sat: number): void;

export function contrast(data: Uint8Array, factor: number): void;

export function dehaze(data: Uint8Array, amount: number): void;

export function edge_detect(data: Uint8Array, width: number, height: number, sensitivity: number): void;

export function exposure(data: Uint8Array, stops: number): void;

export function grain(data: Uint8Array, amount: number): void;

export function grayscale(data: Uint8Array, intensity: number): void;

export function highlights(data: Uint8Array, value: number): void;

export function hsl_adjust(data: Uint8Array, r_h: number, r_s: number, r_l: number, o_h: number, o_s: number, o_l: number, y_h: number, y_s: number, y_l: number, g_h: number, g_s: number, g_l: number, a_h: number, a_s: number, a_l: number, b_h: number, b_s: number, b_l: number, p_h: number, p_s: number, p_l: number, m_h: number, m_s: number, m_l: number): void;

export function hue_rotate(data: Uint8Array, degrees: number): void;

export function invert(data: Uint8Array, intensity: number): void;

export function saturation(data: Uint8Array, factor: number): void;

export function sepia(data: Uint8Array, intensity: number): void;

export function shadows(data: Uint8Array, value: number): void;

export function sharpen(data: Uint8Array, width: number, height: number, amount: number): void;

export function temperature(data: Uint8Array, value: number): void;

export function threshold(data: Uint8Array, value: number): void;

export function tint(data: Uint8Array, value: number): void;

export function vignette(data: Uint8Array, width: number, height: number, strength: number): void;

export function whites(data: Uint8Array, value: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly blacks: (a: number, b: number, c: any, d: number) => void;
    readonly box_blur: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly brightness: (a: number, b: number, c: any, d: number) => void;
    readonly clarity: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly color_grade: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly contrast: (a: number, b: number, c: any, d: number) => void;
    readonly dehaze: (a: number, b: number, c: any, d: number) => void;
    readonly edge_detect: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly exposure: (a: number, b: number, c: any, d: number) => void;
    readonly grain: (a: number, b: number, c: any, d: number) => void;
    readonly grayscale: (a: number, b: number, c: any, d: number) => void;
    readonly highlights: (a: number, b: number, c: any, d: number) => void;
    readonly hsl_adjust: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number) => void;
    readonly hue_rotate: (a: number, b: number, c: any, d: number) => void;
    readonly invert: (a: number, b: number, c: any, d: number) => void;
    readonly saturation: (a: number, b: number, c: any, d: number) => void;
    readonly sepia: (a: number, b: number, c: any, d: number) => void;
    readonly shadows: (a: number, b: number, c: any, d: number) => void;
    readonly sharpen: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly temperature: (a: number, b: number, c: any, d: number) => void;
    readonly threshold: (a: number, b: number, c: any, d: number) => void;
    readonly tint: (a: number, b: number, c: any, d: number) => void;
    readonly vignette: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly whites: (a: number, b: number, c: any, d: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
