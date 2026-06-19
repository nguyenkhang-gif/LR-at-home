/* tslint:disable */
/* eslint-disable */

export function box_blur(data: Uint8Array, width: number, height: number, radius: number): void;

export function brightness(data: Uint8Array, value: number): void;

export function contrast(data: Uint8Array, factor: number): void;

export function edge_detect(data: Uint8Array, width: number, height: number, sensitivity: number): void;

export function grayscale(data: Uint8Array, intensity: number): void;

export function hue_rotate(data: Uint8Array, degrees: number): void;

export function invert(data: Uint8Array, intensity: number): void;

export function saturation(data: Uint8Array, factor: number): void;

export function sepia(data: Uint8Array, intensity: number): void;

export function sharpen(data: Uint8Array, width: number, height: number, amount: number): void;

export function threshold(data: Uint8Array, value: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly box_blur: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly brightness: (a: number, b: number, c: any, d: number) => void;
    readonly contrast: (a: number, b: number, c: any, d: number) => void;
    readonly edge_detect: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly grayscale: (a: number, b: number, c: any, d: number) => void;
    readonly hue_rotate: (a: number, b: number, c: any, d: number) => void;
    readonly invert: (a: number, b: number, c: any, d: number) => void;
    readonly saturation: (a: number, b: number, c: any, d: number) => void;
    readonly sepia: (a: number, b: number, c: any, d: number) => void;
    readonly sharpen: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
    readonly threshold: (a: number, b: number, c: any, d: number) => void;
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
