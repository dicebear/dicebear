//! Key-based pseudorandom number generator and its primitives.

pub mod fnv1a;
mod mulberry32;

pub use mulberry32::Mulberry32;

use std::collections::HashMap;
use std::collections::HashSet;
use std::fmt::Display;

use crate::utils::number::round_half_up;

/// A numeric range with an optional quantization step, mirroring the `Range`
/// shape in the style-definition schema. `min`/`max` may be given in any order
/// — the generator sorts them internally.
#[derive(Debug, Clone, Copy, serde::Deserialize)]
pub struct Range {
    pub min: f64,
    pub max: f64,
    pub step: Option<f64>,
}

/// Key-based pseudorandom number generator.
///
/// Each method takes a key that, combined with the seed, produces a
/// deterministic value. The same seed + key always yields the same result,
/// regardless of call order.
pub struct Prng {
    seed: String,
}

impl Prng {
    pub fn new(seed: impl Into<String>) -> Self {
        Self { seed: seed.into() }
    }

    /// Picks a single item from `items` deterministically. Returns `None` for
    /// an empty slice. Duplicate values (by string representation) are
    /// collapsed before picking so that input order and duplication do not
    /// affect the result.
    pub fn pick<'a, T: Display>(&self, key: &str, items: &'a [T]) -> Option<&'a T> {
        if items.is_empty() {
            return None;
        }

        if items.len() == 1 {
            return Some(&items[0]);
        }

        let mut unique = unique_by_code_point(items);

        if unique.len() == 1 {
            return Some(unique[0]);
        }

        unique.sort_by(|a, b| cmp_utf16(a.to_string(), b.to_string()));
        let index = (self.get_value(key) * unique.len() as f64).floor() as usize;

        Some(unique[index])
    }

    /// Picks a key from `weights` proportional to its weight. When all weights
    /// are zero, falls back to an unweighted [`pick`](Self::pick). Returns
    /// `None` for an empty map.
    pub fn weighted_pick(&self, key: &str, weights: &HashMap<String, f64>) -> Option<String> {
        if weights.is_empty() {
            return None;
        }

        if weights.len() == 1 {
            return weights.keys().next().cloned();
        }

        let mut keys: Vec<&String> = weights.keys().collect();
        keys.sort_by(|a, b| cmp_utf16(a.as_str(), b.as_str()));

        // Sum in sorted-key order to match the JS reduce-over-sorted parity:
        // float addition is non-associative, so insertion order would diverge.
        let mut total_weight = 0.0;
        for k in &keys {
            total_weight += weights[*k];
        }

        if total_weight == 0.0 {
            let sorted: Vec<String> = keys.iter().map(|k| (*k).clone()).collect();
            return self.pick(key, &sorted).cloned();
        }

        let threshold = self.get_value(key) * total_weight;
        let mut cumulative = 0.0;

        for k in &keys {
            cumulative += weights[*k];

            if threshold < cumulative {
                return Some((*k).clone());
            }
        }

        Some((*keys[keys.len() - 1]).clone())
    }

    /// Returns `true` with the given probability (0–100).
    pub fn bool(&self, key: &str, likelihood: f64) -> bool {
        self.get_value(key) * 100.0 < likelihood
    }

    /// Returns a deterministic float in `range`, rounded to four decimal
    /// places. With `step > 0`, the result is drawn uniformly from
    /// `{ min + i*step | 0 ≤ i ≤ floor((max - min) / step) }`, so both
    /// endpoints of an evenly-divisible range are equally likely. A
    /// non-positive or absent step means continuous.
    pub fn float(&self, key: &str, range: &Range) -> f64 {
        let min = range.min.min(range.max);
        let max = range.min.max(range.max);
        let step = range.step.unwrap_or(0.0);

        let value = if step > 0.0 {
            let buckets = ((max - min) / step).floor() + 1.0;
            let i = (self.get_value(key) * buckets).floor();
            min + i * step
        } else {
            min + self.get_value(key) * (max - min)
        };

        round_half_up(value * 10000.0) / 10000.0
    }

    /// Returns a deterministic integer in `range`. `range.step` is accepted for
    /// symmetry with [`float`](Self::float) but ignored — integers step by 1.
    pub fn integer(&self, key: &str, range: &Range) -> i64 {
        let min = range.min.min(range.max);
        let max = range.min.max(range.max);

        ((self.get_value(key) * (max - min + 1.0)).floor() + min) as i64
    }

    /// Fisher-Yates shuffle with chained Mulberry32 state. Duplicate values
    /// (by string representation) are collapsed before shuffling.
    pub fn shuffle<T: Display + Clone>(&self, key: &str, items: &[T]) -> Vec<T> {
        if items.len() <= 1 {
            return items.to_vec();
        }

        let mut refs = unique_by_code_point(items);
        refs.sort_by(|a, b| cmp_utf16(a.to_string(), b.to_string()));
        let mut result: Vec<T> = refs.into_iter().cloned().collect();

        let mut prng = Mulberry32::new(fnv1a::hash(&format!("{}:{}", self.seed, key)));

        for i in (1..result.len()).rev() {
            let j = (prng.next_float() * (i as f64 + 1.0)).floor() as usize;
            result.swap(i, j);
        }

        result
    }

    /// Returns a single float in `[0, 1)` derived from `seed:key`. The same
    /// seed/key pair always produces the same value.
    pub fn get_value(&self, key: &str) -> f64 {
        Mulberry32::new(fnv1a::hash(&format!("{}:{}", self.seed, key))).next_float()
    }
}

/// Compares two values' string representations by UTF-16 code units, matching
/// the JS reference's `#compareByCodePoint` (JS string `<` compares code units).
/// Agrees with Rust's default `str` ordering for all BMP text; differs only for
/// supplementary-plane characters, where UTF-16 and code-point order disagree.
pub(crate) fn cmp_utf16(a: impl AsRef<str>, b: impl AsRef<str>) -> std::cmp::Ordering {
    a.as_ref().encode_utf16().cmp(b.as_ref().encode_utf16())
}

/// Deduplicates by string representation, keeping the first occurrence, and
/// returns references into `items`.
pub(crate) fn unique_by_code_point<T: Display>(items: &[T]) -> Vec<&T> {
    let mut seen = HashSet::new();
    let mut result = Vec::new();

    for item in items {
        if seen.insert(item.to_string()) {
            result.push(item);
        }
    }

    result
}

/// Cross-language parity: asserts the PRNG primitives produce exactly the values
/// in the shared fixtures under `<repo>/tests/fixtures/parity/`, the same the
/// JS, PHP, Python, Go and Dart suites run against.
#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::fs;
    use std::path::PathBuf;

    use serde_json::Value;

    use super::{fnv1a, Mulberry32, Prng, Range};

    fn fixture(name: &str) -> Value {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../../tests/fixtures/parity")
            .join(name);
        let text =
            fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
        serde_json::from_str(&text).unwrap()
    }

    fn range_from(v: &Value) -> Range {
        Range {
            min: v["min"].as_f64().unwrap(),
            max: v["max"].as_f64().unwrap(),
            step: v.get("step").and_then(Value::as_f64),
        }
    }

    fn strings(v: &Value) -> Vec<String> {
        v.as_array()
            .unwrap()
            .iter()
            .map(|x| x.as_str().unwrap().to_string())
            .collect()
    }

    #[test]
    fn fnv1a_parity() {
        for e in fixture("fnv1a.json").as_array().unwrap() {
            let input = e["input"].as_str().unwrap();
            assert_eq!(
                u64::from(fnv1a::hash(input)),
                e["hash"].as_u64().unwrap(),
                "hash {input:?}"
            );
            assert_eq!(
                fnv1a::hex(input),
                e["hex"].as_str().unwrap(),
                "hex {input:?}"
            );
        }
    }

    #[test]
    fn mulberry32_parity() {
        for e in fixture("mulberry32.json").as_array().unwrap() {
            let seed = e["seed"].as_u64().unwrap() as u32;
            let mut m = Mulberry32::new(seed);

            for step in e["sequence"].as_array().unwrap() {
                let float = m.next_float();
                let state = m.state();
                assert_eq!(float, step["float"].as_f64().unwrap(), "float seed {seed}");
                assert_eq!(
                    i64::from(state),
                    step["state"].as_i64().unwrap(),
                    "state seed {seed}"
                );
            }
        }
    }

    #[test]
    fn prng_parity() {
        let f = fixture("prng.json");

        for c in f["getValue"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            assert_eq!(
                p.get_value(c["key"].as_str().unwrap()),
                c["result"].as_f64().unwrap(),
                "getValue {c}"
            );
        }

        for c in f["pick"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            let items = strings(&c["items"]);
            let got = p.pick(c["key"].as_str().unwrap(), &items).cloned();
            let want = c["result"].as_str().map(str::to_string);
            assert_eq!(got, want, "pick {c}");
        }

        for c in f["weightedPick"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            let weights: HashMap<String, f64> = c["weights"]
                .as_object()
                .unwrap()
                .iter()
                .map(|(k, v)| (k.clone(), v.as_f64().unwrap()))
                .collect();
            let got = p.weighted_pick(c["key"].as_str().unwrap(), &weights);
            let want = c["result"].as_str().map(str::to_string);
            assert_eq!(got, want, "weightedPick {c}");
        }

        for c in f["bool"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            let got = p.bool(
                c["key"].as_str().unwrap(),
                c["likelihood"].as_f64().unwrap(),
            );
            assert_eq!(got, c["result"].as_bool().unwrap(), "bool {c}");
        }

        for c in f["float"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            let got = p.float(c["key"].as_str().unwrap(), &range_from(&c["range"]));
            assert_eq!(got, c["result"].as_f64().unwrap(), "float {c}");
        }

        for c in f["integer"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            let got = p.integer(c["key"].as_str().unwrap(), &range_from(&c["range"]));
            assert_eq!(got, c["result"].as_i64().unwrap(), "integer {c}");
        }

        for c in f["shuffle"].as_array().unwrap() {
            let p = Prng::new(c["seed"].as_str().unwrap());
            let items = strings(&c["items"]);
            let got = p.shuffle(c["key"].as_str().unwrap(), &items);
            assert_eq!(got, strings(&c["result"]), "shuffle {c}");
        }
    }
}
