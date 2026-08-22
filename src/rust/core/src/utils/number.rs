//! Numeric helpers shared by the renderer and the PRNG.

/// Formats a number for SVG output, rounded to at most 5 decimal places.
///
/// Rounding to a fixed precision keeps the output bounded and identical across
/// every port: every value becomes a multiple of `1e-5`, which has no
/// exponential form, so the result is built from integer arithmetic with no
/// locale- or language-specific float stringifying.
pub fn format(value: f64) -> String {
    if value.is_nan() {
        return "NaN".to_string();
    }
    if value == f64::INFINITY {
        return "Infinity".to_string();
    }
    if value == f64::NEG_INFINITY {
        return "-Infinity".to_string();
    }

    let scaled = round_half_up(value * 100_000.0) as i64;
    let sign = if scaled < 0 { "-" } else { "" };
    // `unsigned_abs` avoids overflow on `i64::MIN` (unreachable for real canvas
    // values, but keeps the conversion total).
    let scaled = scaled.unsigned_abs();

    let integer_part = scaled / 100_000;
    let fraction = format!("{:05}", scaled % 100_000);
    let fraction = fraction.trim_end_matches('0');

    if fraction.is_empty() {
        format!("{sign}{integer_part}")
    } else {
        format!("{sign}{integer_part}.{fraction}")
    }
}

/// Rounds half toward +∞, matching JavaScript's `Math.round`. Rust's
/// `f64::round` rounds half away from zero, and the naive `(x + 0.5).floor()`
/// over-rounds the largest double below `0.5`; comparing the fractional part
/// against `0.5` reproduces `Math.round` exactly.
pub(crate) fn round_half_up(value: f64) -> f64 {
    let floor = value.floor();

    if value - floor < 0.5 {
        floor
    } else {
        floor + 1.0
    }
}

/// Cross-language parity against the shared `numbers.json` fixture.
#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;

    use serde_json::Value;

    use super::format;

    fn fixture(name: &str) -> Value {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../../tests/fixtures/parity")
            .join(name);
        let text =
            fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
        serde_json::from_str(&text).unwrap()
    }

    #[test]
    fn number_parity() {
        for e in fixture("numbers.json").as_array().unwrap() {
            let input = e["input"].as_f64().unwrap();
            assert_eq!(
                format(input),
                e["output"].as_str().unwrap(),
                "format {input}"
            );
        }
    }
}
