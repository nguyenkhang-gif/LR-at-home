let instance = null;
let initPromise = null;

export async function getWasm() {
  if (instance) return instance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // wasm-pack --target web output: default export = init function
    const mod = await import('../public/wasm/img_wasm.js');
    await mod.default();
    instance = mod;
    return instance;
  })();

  return initPromise;
}
