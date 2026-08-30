/// The interpreted `animation` option: off, all timelines, or a selection of
/// timeline names.
library;

/// The interpreted `animation` option: off, all timelines, or a selection of
/// timeline names.
///
/// Built from the raw memoized option value, so the resolved-options snapshot
/// keeps the user's shape (a boolean, or the name list in the given order)
/// while consumers work with these accessors.
class AnimationSelection {
  final bool _all;
  final List<String>? _names;

  const AnimationSelection._(this._all, this._names);

  factory AnimationSelection.from(Object? raw) {
    if (raw is bool) {
      return AnimationSelection._(raw, null);
    }

    if (raw is List<String>) {
      return AnimationSelection._(false, raw);
    }

    return const AnimationSelection._(false, null);
  }

  /// Whether no timeline plays at all.
  bool get off {
    final names = _names;

    return !_all && (names == null || names.isEmpty);
  }

  /// Whether a timeline carrying the given [name] plays. `true` plays every
  /// timeline. A name selection plays only named timelines carrying one of
  /// the selected names.
  bool matches(String? name) {
    if (_all) {
      return true;
    }

    final names = _names;

    if (name == null || names == null) {
      return false;
    }

    return names.contains(name);
  }

  /// The selected names in user order, or `null` for the boolean forms.
  /// Consumed by the animation class namespace hash.
  List<String>? get names => _names;
}
