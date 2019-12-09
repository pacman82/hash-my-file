use hmac_sha256;
use md5;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "computeMd5")]
pub fn compute_md5(input: &[u8]) -> String {
    format!("{:x}", md5::compute(input))
}

#[wasm_bindgen(js_name = "computeSha256")]
pub fn compute_sha256(input: &[u8]) -> String {
    let hash = hmac_sha256::Hash::hash(input);
    hash.iter().map(|byte| format!("{:02x}", byte)).collect()
}
