//! Derives display initials from a seed string.
//!
//! Words are split by Unicode letter/mark classes (`\p{L}`, `\p{M}`) so the
//! result matches every other port for accented and non-Latin input.
//! See <https://www.regular-expressions.info/unicode.html>.

use std::sync::LazyLock;

use regex::Regex;

/// `@…` — the entire suffix (e.g. an email domain), stripped so the local part
/// yields one word. `(?s)` makes `.` match line terminators too, so the whole
/// tail is removed — matching the dotall `@.*` strip in every port.
static RE_AT: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"(?s)@.*").unwrap());
/// Apostrophes and accents that should not break a word (e.g. `l'eau`, `d´or`).
static RE_QUOTES: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[`´'ʼ]").unwrap());
/// A word: a letter followed by any letters or combining marks.
static RE_WORD: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\p{L}[\p{L}\p{M}]*").unwrap());
/// The first one or two grapheme-ish units (letter + trailing marks) of a word.
static RE_TWO: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^(?:\p{L}\p{M}*){1,2}").unwrap());
/// The first single unit (letter + trailing marks) of a word.
static RE_ONE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^(?:\p{L}\p{M}*)").unwrap());

/// Returns one or two uppercase initials for `seed`, discarding an `@…` suffix
/// so email addresses yield a single initial.
pub fn from_seed(seed: &str) -> String {
    from_seed_with(seed, true)
}

/// Like [`from_seed`], but `discard_at_symbol` controls whether an `@…` suffix
/// is stripped before deriving initials.
pub fn from_seed_with(seed: &str, discard_at_symbol: bool) -> String {
    let mut input = seed.to_string();

    if discard_at_symbol {
        // Only the first match, mirroring JS `replace(/@.*/, '')` (no `g` flag).
        input = RE_AT.replacen(&input, 1, "").into_owned();
    }

    input = RE_QUOTES.replace_all(&input, "").into_owned();

    let words: Vec<&str> = RE_WORD.find_iter(&input).map(|m| m.as_str()).collect();

    if words.is_empty() {
        return if discard_at_symbol {
            from_seed_with(seed, false)
        } else {
            String::new()
        };
    }

    if words.len() == 1 {
        return RE_TWO
            .find(words[0])
            .map(|m| m.as_str().to_uppercase())
            .unwrap_or_default();
    }

    let first = RE_ONE.find(words[0]);
    let last = RE_ONE.find(words[words.len() - 1]);

    match (first, last) {
        (Some(f), Some(l)) => format!("{}{}", f.as_str(), l.as_str()).to_uppercase(),
        _ => String::new(),
    }
}

/// Cross-language parity against the shared `initials.json` fixture.
#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;

    use serde_json::Value;

    use super::from_seed;

    fn fixture(name: &str) -> Value {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../../tests/fixtures/parity")
            .join(name);
        let text =
            fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
        serde_json::from_str(&text).unwrap()
    }

    #[test]
    fn initials_parity() {
        for e in fixture("initials.json").as_array().unwrap() {
            let seed = e["seed"].as_str().unwrap();
            assert_eq!(
                from_seed(seed),
                e["result"].as_str().unwrap(),
                "initials {seed:?}"
            );
        }
    }
}
