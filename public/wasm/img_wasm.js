/* @ts-self-types="./img_wasm.d.ts" */

/**
 * @param {Uint8Array} data
 * @param {Uint8Array} lut
 */
export function apply_lut(data, lut) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(lut, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    wasm.apply_lut(ptr0, len0, data, ptr1, len1);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function blacks(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.blacks(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
export function box_blur(data, width, height, radius) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.box_blur(ptr0, len0, data, width, height, radius);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function brightness(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.brightness(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {number} amount
 */
export function clarity(data, width, height, amount) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.clarity(ptr0, len0, data, width, height, amount);
}

/**
 * @param {Uint8Array} data
 * @param {number} shadow_hue
 * @param {number} shadow_sat
 * @param {number} mid_hue
 * @param {number} mid_sat
 * @param {number} hi_hue
 * @param {number} hi_sat
 */
export function color_grade(data, shadow_hue, shadow_sat, mid_hue, mid_sat, hi_hue, hi_sat) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.color_grade(ptr0, len0, data, shadow_hue, shadow_sat, mid_hue, mid_sat, hi_hue, hi_sat);
}

/**
 * @param {Uint8Array} data
 * @param {number} factor
 */
export function contrast(data, factor) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.contrast(ptr0, len0, data, factor);
}

/**
 * @param {Uint8Array} data
 * @param {number} amount
 */
export function dehaze(data, amount) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.dehaze(ptr0, len0, data, amount);
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {number} sensitivity
 */
export function edge_detect(data, width, height, sensitivity) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.edge_detect(ptr0, len0, data, width, height, sensitivity);
}

/**
 * @param {Uint8Array} data
 * @param {number} stops
 */
export function exposure(data, stops) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.exposure(ptr0, len0, data, stops);
}

/**
 * @param {Uint8Array} data
 * @param {number} amount
 */
export function grain(data, amount) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.grain(ptr0, len0, data, amount);
}

/**
 * @param {Uint8Array} data
 * @param {number} intensity
 */
export function grayscale(data, intensity) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.grayscale(ptr0, len0, data, intensity);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function highlights(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.highlights(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} r_h
 * @param {number} r_s
 * @param {number} r_l
 * @param {number} o_h
 * @param {number} o_s
 * @param {number} o_l
 * @param {number} y_h
 * @param {number} y_s
 * @param {number} y_l
 * @param {number} g_h
 * @param {number} g_s
 * @param {number} g_l
 * @param {number} a_h
 * @param {number} a_s
 * @param {number} a_l
 * @param {number} b_h
 * @param {number} b_s
 * @param {number} b_l
 * @param {number} p_h
 * @param {number} p_s
 * @param {number} p_l
 * @param {number} m_h
 * @param {number} m_s
 * @param {number} m_l
 */
export function hsl_adjust(data, r_h, r_s, r_l, o_h, o_s, o_l, y_h, y_s, y_l, g_h, g_s, g_l, a_h, a_s, a_l, b_h, b_s, b_l, p_h, p_s, p_l, m_h, m_s, m_l) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.hsl_adjust(ptr0, len0, data, r_h, r_s, r_l, o_h, o_s, o_l, y_h, y_s, y_l, g_h, g_s, g_l, a_h, a_s, a_l, b_h, b_s, b_l, p_h, p_s, p_l, m_h, m_s, m_l);
}

/**
 * @param {Uint8Array} data
 * @param {number} degrees
 */
export function hue_rotate(data, degrees) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.hue_rotate(ptr0, len0, data, degrees);
}

/**
 * @param {Uint8Array} data
 * @param {number} intensity
 */
export function invert(data, intensity) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.invert(ptr0, len0, data, intensity);
}

/**
 * @param {Uint8Array} data
 * @param {number} factor
 */
export function saturation(data, factor) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.saturation(ptr0, len0, data, factor);
}

/**
 * @param {Uint8Array} data
 * @param {number} intensity
 */
export function sepia(data, intensity) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.sepia(ptr0, len0, data, intensity);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function shadows(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.shadows(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {number} amount
 */
export function sharpen(data, width, height, amount) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.sharpen(ptr0, len0, data, width, height, amount);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function temperature(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.temperature(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function threshold(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.threshold(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function tint(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.tint(ptr0, len0, data, value);
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {number} strength
 */
export function vignette(data, width, height, strength) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.vignette(ptr0, len0, data, width, height, strength);
}

/**
 * @param {Uint8Array} data
 * @param {number} value
 */
export function whites(data, value) {
    var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.whites(ptr0, len0, data, value);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_copy_to_typed_array_c5728021fabd0236: function(arg0, arg1, arg2) {
            new Uint8Array(arg2.buffer, arg2.byteOffset, arg2.byteLength).set(getArrayU8FromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./img_wasm_bg.js": import0,
    };
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('img_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
