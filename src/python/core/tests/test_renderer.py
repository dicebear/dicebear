"""Tests for SVG rendering (driven through Avatar)."""

from __future__ import annotations

import re
from typing import Any

from dicebear import Avatar, Style


def _minimal_style() -> Style:
    return Style({"canvas": {"width": 100, "height": 100, "elements": []}})


def _style_with_components() -> Style:
    return Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [{"type": "component", "name": "eyes"}],
            },
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "variants": {
                        "open": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"r": "5"},
                                }
                            ]
                        },
                        "closed": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "line",
                                    "attributes": {"x1": "0", "x2": "10"},
                                }
                            ]
                        },
                    },
                }
            },
        }
    )


def _style_with_ids() -> Style:
    return Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "defs",
                        "children": [
                            {
                                "type": "element",
                                "name": "linearGradient",
                                "attributes": {"id": "grad1"},
                                "children": [
                                    {
                                        "type": "element",
                                        "name": "stop",
                                        "attributes": {
                                            "offset": "0%",
                                            "stop-color": "red",
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "type": "element",
                        "name": "rect",
                        "attributes": {"fill": "url(#grad1)"},
                    },
                ],
            }
        }
    )


def _style_with_component(extras: dict[str, Any] | None = None) -> Style:
    eyes: dict[str, Any] = {"width": 50, "height": 50}
    eyes.update(extras or {})
    eyes["variants"] = {"open": {"elements": [{"type": "element", "name": "rect"}]}}

    return Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [{"type": "component", "name": "eyes"}],
            },
            "components": {"eyes": eyes},
        }
    )


# ---------------------------------------------------------------------------
# SVG wrapper
# ---------------------------------------------------------------------------


def test_svg_with_view_box() -> None:
    svg = Avatar(_minimal_style()).to_string()
    assert svg.startswith("<svg ")
    assert 'xmlns="http://www.w3.org/2000/svg"' in svg
    assert 'viewBox="0 0 100 100"' in svg
    assert svg.endswith("</svg>")


def test_title_sets_role_img_and_aria_label() -> None:
    svg = Avatar(_minimal_style(), {"title": "Test Avatar"}).to_string()
    assert 'role="img"' in svg
    assert 'aria-label="Test Avatar"' in svg
    assert "<title>Test Avatar</title>" in svg


def test_title_escaped() -> None:
    svg = Avatar(_minimal_style(), {"title": "A & B <C>"}).to_string()
    assert 'aria-label="A &amp; B &lt;C&gt;"' in svg
    assert "<title>A &amp; B &lt;C&gt;</title>" in svg


def test_aria_hidden_without_title() -> None:
    svg = Avatar(_minimal_style()).to_string()
    assert 'aria-hidden="true"' in svg
    assert 'role="img"' not in svg
    assert "<title>" not in svg


def test_size_included_when_set() -> None:
    svg = Avatar(_minimal_style(), {"size": 64}).to_string()
    assert 'width="64"' in svg
    assert 'height="64"' in svg


def test_size_not_included_when_not_set() -> None:
    svg = Avatar(_minimal_style()).to_string()
    open_tag = svg[: svg.index(">") + 1]
    assert "width=" not in open_tag
    assert "height=" not in open_tag


# ---------------------------------------------------------------------------
# element rendering
# ---------------------------------------------------------------------------


def test_self_closing_elements() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "rect",
                        "attributes": {
                            "x": "0",
                            "y": "0",
                            "width": "100",
                            "height": "100",
                        },
                    }
                ],
            }
        }
    )
    svg = Avatar(style).to_string()
    assert '<rect x="0" y="0" width="100" height="100"/>' in svg


def test_elements_with_children() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "g",
                        "children": [
                            {
                                "type": "element",
                                "name": "circle",
                                "attributes": {"cx": "50", "cy": "50", "r": "10"},
                            }
                        ],
                    }
                ],
            }
        }
    )
    svg = Avatar(style).to_string()
    assert '<g><circle cx="50" cy="50" r="10"/></g>' in svg


def test_nested_elements() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "g",
                        "attributes": {"id": "outer"},
                        "children": [
                            {
                                "type": "element",
                                "name": "g",
                                "attributes": {"id": "inner"},
                                "children": [{"type": "element", "name": "rect"}],
                            }
                        ],
                    }
                ],
            }
        }
    )
    svg = Avatar(style).to_string()
    assert '<g id="outer"><g id="inner"><rect/></g></g>' in svg


# ---------------------------------------------------------------------------
# text rendering
# ---------------------------------------------------------------------------


def _text_style(value: Any) -> Style:
    return Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "text",
                        "children": [{"type": "text", "value": value}],
                    }
                ],
            }
        }
    )


def test_text_content() -> None:
    svg = Avatar(_text_style("Hello")).to_string()
    assert "<text>Hello</text>" in svg


def test_variable_reference_initial() -> None:
    svg = Avatar(
        _text_style({"type": "variable", "name": "initial"}), {"seed": "Alice"}
    ).to_string()
    assert "<text>A</text>" in svg


def test_initials_multi_word() -> None:
    svg = Avatar(
        _text_style({"type": "variable", "name": "initials"}), {"seed": "Alice Bob"}
    ).to_string()
    assert "<text>AB</text>" in svg


def test_initials_single_word() -> None:
    svg = Avatar(
        _text_style({"type": "variable", "name": "initials"}), {"seed": "Alice"}
    ).to_string()
    assert "<text>AL</text>" in svg


def test_initials_discard_at_symbol() -> None:
    svg = Avatar(
        _text_style({"type": "variable", "name": "initials"}),
        {"seed": "alice@example.com"},
    ).to_string()
    assert "<text>AL</text>" in svg


# ---------------------------------------------------------------------------
# component rendering
# ---------------------------------------------------------------------------


def test_renders_selected_variant() -> None:
    svg = Avatar(
        _style_with_components(), {"seed": "test", "eyesVariant": "open"}
    ).to_string()
    assert '<circle r="5"/>' in svg
    assert "<line" not in svg


def test_registers_variant_body_in_defs_and_references_it_via_use() -> None:
    svg = Avatar(
        _style_with_components(), {"seed": "test", "eyesVariant": "open"}
    ).to_string()
    match = re.search(r'<g id="(eyes-open-[a-f0-9]+)"><circle r="5"/></g>', svg)
    assert match is not None
    assert "<defs>" in svg
    assert f'<use href="#{match.group(1)}"/>' in svg


def test_skips_component_with_probability_zero() -> None:
    svg = Avatar(
        _style_with_components(), {"seed": "test", "eyesProbability": 0}
    ).to_string()
    assert "<circle" not in svg
    assert "<line" not in svg
    assert "<use" not in svg


def test_component_transforms_from_definition() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [{"type": "component", "name": "eyes"}],
            },
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "translate": {
                        "x": {"min": 5, "max": 5},
                        "y": {"min": 10, "max": 10},
                    },
                    "variants": {
                        "open": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"r": "5"},
                                }
                            ]
                        }
                    },
                }
            },
        }
    )
    svg = Avatar(style, {"seed": "test"}).to_string()
    assert '<use transform="translate(2.5, 5)" href="#eyes-open-' in svg


def test_component_rotation_from_definition_with_center() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [{"type": "component", "name": "eyes"}],
            },
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "rotate": {"min": 45, "max": 45},
                    "variants": {
                        "open": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"r": "5"},
                                }
                            ]
                        }
                    },
                }
            },
        }
    )
    svg = Avatar(style, {"seed": "test"}).to_string()
    assert '<use transform="rotate(45, 25, 25)" href="#eyes-open-' in svg


def test_omits_transform_attribute_without_component_transforms() -> None:
    svg = Avatar(
        _style_with_components(), {"seed": "test", "eyesVariant": "open"}
    ).to_string()
    assert '<use href="#eyes-open-' in svg
    assert re.search(r"<use[^>]*\btransform=", svg) is None


def test_applies_attributes_from_component_reference_to_use_tag() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "component",
                        "name": "eyes",
                        "attributes": {
                            "transform": "matrix(.5 0 0 .5 10 20)",
                            "opacity": ".75",
                        },
                    }
                ],
            },
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "variants": {
                        "open": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"r": "5"},
                                }
                            ]
                        }
                    },
                }
            },
        }
    )
    svg = Avatar(style, {"seed": "test", "eyesVariant": "open"}).to_string()
    assert (
        '<use transform="matrix(.5 0 0 .5 10 20)" opacity=".75" href="#eyes-open-'
        in svg
    )


def test_prepends_user_transform_to_built_in_component_transforms() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "component",
                        "name": "eyes",
                        "attributes": {"transform": "matrix(.5 0 0 .5 10 20)"},
                    }
                ],
            },
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "rotate": {"min": 45, "max": 45},
                    "variants": {
                        "open": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"r": "5"},
                                }
                            ]
                        }
                    },
                }
            },
        }
    )
    svg = Avatar(style, {"seed": "test"}).to_string()
    assert (
        '<use transform="matrix(.5 0 0 .5 10 20) rotate(45, 25, 25)" href="#eyes-open-'
        in svg
    )


def test_deduplicates_identical_component_references() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {"type": "component", "name": "eyes"},
                    {"type": "component", "name": "eyes"},
                ],
            },
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "variants": {
                        "open": {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"r": "5"},
                                }
                            ]
                        }
                    },
                }
            },
        }
    )
    svg = Avatar(style, {"seed": "test", "eyesVariant": "open"}).to_string()
    assert len(re.findall(r'<circle r="5"/>', svg)) == 1
    assert len(re.findall(r'<use href="#eyes-open-[a-f0-9]+"/>', svg)) == 2


# ---------------------------------------------------------------------------
# color rendering
# ---------------------------------------------------------------------------


def test_solid_color_reference() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "rect",
                        "attributes": {"fill": {"type": "color", "name": "bg"}},
                    }
                ],
            },
            "colors": {"bg": {"values": ["#ff0000"]}},
        }
    )
    svg = Avatar(style, {"seed": "test", "bgColor": ["#ff0000"]}).to_string()
    assert 'fill="#ff0000"' in svg


def test_linear_gradient() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "rect",
                        "attributes": {"fill": {"type": "color", "name": "bg"}},
                    }
                ],
            },
            "colors": {"bg": {"values": ["#ff0000", "#0000ff"]}},
        }
    )
    svg = Avatar(
        style,
        {"seed": "test", "bgColor": ["#ff0000", "#0000ff"], "bgColorFill": "linear"},
    ).to_string()
    assert "<defs>" in svg
    assert '<linearGradient id="bg-color-' in svg
    assert 'stop-color="#ff0000"' in svg
    assert 'stop-color="#0000ff"' in svg
    assert 'fill="url(#bg-color-' in svg


def test_radial_gradient() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "rect",
                        "attributes": {"fill": {"type": "color", "name": "bg"}},
                    }
                ],
            },
            "colors": {"bg": {"values": ["#ff0000", "#0000ff"]}},
        }
    )
    svg = Avatar(
        style,
        {"seed": "test", "bgColor": ["#ff0000", "#0000ff"], "bgColorFill": "radial"},
    ).to_string()
    assert '<radialGradient id="bg-color-' in svg


# ---------------------------------------------------------------------------
# flip
# ---------------------------------------------------------------------------


def test_horizontal_flip() -> None:
    svg = Avatar(_minimal_style(), {"flip": "horizontal"}).to_string()
    assert "scale(-1, 1)" in svg
    assert "translate(100, 0)" in svg


def test_vertical_flip() -> None:
    svg = Avatar(_minimal_style(), {"flip": "vertical"}).to_string()
    assert "scale(1, -1)" in svg
    assert "translate(0, 100)" in svg


def test_both_flip() -> None:
    svg = Avatar(_minimal_style(), {"flip": "both"}).to_string()
    assert "scale(-1, -1)" in svg
    assert "translate(100, 100)" in svg


def test_no_flip_when_none() -> None:
    svg = Avatar(_minimal_style(), {"flip": "none"}).to_string()
    assert "scale(-1" not in svg


# ---------------------------------------------------------------------------
# scale
# ---------------------------------------------------------------------------


def test_scale_transform() -> None:
    svg = Avatar(_minimal_style(), {"scale": 0.5}).to_string()
    assert "scale(0.5)" in svg
    assert "translate(50, 50)" in svg
    assert "translate(-50, -50)" in svg


def test_no_scale_when_1() -> None:
    svg = Avatar(_minimal_style(), {"scale": 1}).to_string()
    assert "scale(" not in svg


# ---------------------------------------------------------------------------
# component scale
# ---------------------------------------------------------------------------


def test_component_scale_from_definition() -> None:
    svg = Avatar(
        _style_with_component({"scale": {"min": 2, "max": 2}}), {"seed": "test"}
    ).to_string()
    assert "translate(25, 25) scale(2) translate(-25, -25)" in svg


def test_no_component_scale_wrapper_when_definition_is_one() -> None:
    svg = Avatar(_style_with_component(), {"seed": "test"}).to_string()
    assert "scale(" not in svg


def test_component_scale_after_rotate_in_transform_attribute() -> None:
    svg = Avatar(
        _style_with_component(
            {"rotate": {"min": 45, "max": 45}, "scale": {"min": 2, "max": 2}}
        ),
        {"seed": "test"},
    ).to_string()
    rotate_index = svg.find("rotate(45")
    scale_index = svg.find("scale(2)")
    assert rotate_index != -1
    assert scale_index != -1
    assert rotate_index < scale_index


# ---------------------------------------------------------------------------
# borderRadius
# ---------------------------------------------------------------------------


def test_border_radius_via_clip_path() -> None:
    svg = Avatar(_minimal_style(), {"borderRadius": 10}).to_string()
    assert '<clipPath id="clip-' in svg
    assert 'rx="10"' in svg
    assert 'ry="10"' in svg
    assert 'clip-path="url(#clip-' in svg


def test_still_applies_square_clip_path_when_border_radius_is_0() -> None:
    svg = Avatar(_minimal_style(), {"borderRadius": 0}).to_string()
    assert '<clipPath id="clip-' in svg
    assert 'rx="0"' in svg
    assert 'ry="0"' in svg
    assert 'clip-path="url(#clip-' in svg


# ---------------------------------------------------------------------------
# idRandomization
# ---------------------------------------------------------------------------


def test_randomize_ids_when_enabled() -> None:
    svg = Avatar(
        _style_with_ids(), {"seed": "test", "idRandomization": True}
    ).to_string()
    assert 'id="grad1"' not in svg
    assert "url(#grad1)" not in svg
    assert 'id="grad1-' in svg
    assert "url(#grad1-" in svg


def test_preserve_ids_when_disabled() -> None:
    svg = Avatar(
        _style_with_ids(), {"seed": "test", "idRandomization": False}
    ).to_string()
    assert 'id="grad1"' in svg
    assert "url(#grad1)" in svg


def test_different_ids_on_each_call() -> None:
    svg1 = Avatar(
        _style_with_ids(), {"seed": "test", "idRandomization": True}
    ).to_string()
    svg2 = Avatar(
        _style_with_ids(), {"seed": "test", "idRandomization": True}
    ).to_string()
    assert svg1 != svg2


# ---------------------------------------------------------------------------
# background
# ---------------------------------------------------------------------------


def test_solid_background() -> None:
    svg = Avatar(_minimal_style(), {"backgroundColor": ["#ff0000"]}).to_string()
    assert '<rect width="100" height="100" fill="#ff0000"/>' in svg


def test_gradient_background() -> None:
    svg = Avatar(
        _minimal_style(),
        {"backgroundColor": ["#ff0000", "#0000ff"], "backgroundColorFill": "linear"},
    ).to_string()
    assert '<linearGradient id="background-color-' in svg
    assert 'fill="url(#background-color-' in svg


def test_gradient_rotation() -> None:
    svg = Avatar(
        _minimal_style(),
        {
            "backgroundColor": ["#ff0000", "#0000ff"],
            "backgroundColorFill": "linear",
            "backgroundColorAngle": 45,
        },
    ).to_string()
    assert 'gradientTransform="rotate(45, 0.5, 0.5)"' in svg


def test_no_background_without_colors() -> None:
    svg = Avatar(_minimal_style()).to_string()
    # The clipPath wrapper always emits a <rect>; only the background <rect>
    # carries a fill attribute, so check for that specifically.
    assert re.search(r"<rect[^>]*\sfill=", svg) is None


# ---------------------------------------------------------------------------
# global transforms
# ---------------------------------------------------------------------------


def test_global_rotation() -> None:
    svg = Avatar(_minimal_style(), {"rotate": 45}).to_string()
    assert "rotate(45, 50, 50)" in svg


def test_no_rotation_when_0() -> None:
    svg = Avatar(_minimal_style(), {"rotate": 0}).to_string()
    assert "rotate(" not in svg


def test_global_translate() -> None:
    svg = Avatar(_minimal_style(), {"translateX": 10, "translateY": -20}).to_string()
    assert "translate(10, -20)" in svg


# ---------------------------------------------------------------------------
# metadata
# ---------------------------------------------------------------------------


def test_metadata_with_dublin_core() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "meta": {
                "creator": {"name": "John Doe"},
                "source": {"name": "My Style", "url": "https://example.com"},
                "license": {
                    "name": "MIT",
                    "url": "https://opensource.org/licenses/MIT",
                },
            },
        }
    )
    svg = Avatar(style).to_string()
    assert "<metadata" in svg
    assert "<dc:title>My Style</dc:title>" in svg
    assert "<dc:creator>John Doe</dc:creator>" in svg


def test_no_metadata_when_no_meta() -> None:
    svg = Avatar(_minimal_style()).to_string()
    assert "<metadata" not in svg


def test_remix_of_prefix() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "meta": {
                "creator": {"name": "Pablo Stanley"},
                "source": {"name": "Avataaars", "url": "https://avataaars.com"},
                "license": {
                    "name": "CC BY 4.0",
                    "url": "https://creativecommons.org/licenses/by/4.0/",
                },
            },
        }
    )
    svg = Avatar(style).to_string()
    assert "Remix of" in svg
    assert "Avataaars" in svg


def test_no_remix_of_for_mit_dicebear() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "meta": {
                "creator": {"name": "DiceBear"},
                "source": {"name": "Initials"},
                "license": {"name": "MIT"},
            },
        }
    )
    svg = Avatar(style).to_string()
    assert "Remix of" not in svg
    assert "Initials" in svg


def test_xml_escaping_in_metadata() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "meta": {
                "creator": {"name": "A & B"},
                "source": {"name": "<Script>"},
                "license": {"name": "MIT"},
            },
        }
    )
    svg = Avatar(style).to_string()
    assert "A &amp; B" in svg
    assert "&lt;Script&gt;" in svg


# ---------------------------------------------------------------------------
# variable attributes
# ---------------------------------------------------------------------------


def test_font_family_variable() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "text",
                        "attributes": {
                            "font-family": {"type": "variable", "name": "fontFamily"}
                        },
                        "children": [{"type": "text", "value": "Hello"}],
                    }
                ],
            }
        }
    )
    svg = Avatar(style, {"fontFamily": "Arial"}).to_string()
    assert 'font-family="Arial"' in svg


def test_font_weight_variable() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "text",
                        "attributes": {
                            "font-weight": {"type": "variable", "name": "fontWeight"}
                        },
                        "children": [{"type": "text", "value": "Hello"}],
                    }
                ],
            }
        }
    )
    svg = Avatar(style, {"fontWeight": 700}).to_string()
    assert 'font-weight="700"' in svg


def test_plain_string_font_family() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "text",
                        "attributes": {"font-family": "monospace"},
                        "children": [{"type": "text", "value": "Hello"}],
                    }
                ],
            }
        }
    )
    svg = Avatar(style).to_string()
    assert 'font-family="monospace"' in svg


# ---------------------------------------------------------------------------
# xml escaping
# ---------------------------------------------------------------------------


def test_escape_attribute_values() -> None:
    style = Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {
                        "type": "element",
                        "name": "rect",
                        "attributes": {"d": 'a & b "c"'},
                    }
                ],
            }
        }
    )
    svg = Avatar(style).to_string()
    assert 'd="a &amp; b &quot;c&quot;"' in svg


def test_escape_text_content() -> None:
    svg = Avatar(_text_style('<script>alert("xss")</script>')).to_string()
    assert "<script>" not in svg
    assert "&lt;script&gt;" in svg


# ---------------------------------------------------------------------------
# component aliases
# ---------------------------------------------------------------------------


def _alias_style() -> Style:
    return Style(
        {
            "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                    {"type": "component", "name": "eyes"},
                    {"type": "component", "name": "eyesRight"},
                ],
            },
            "components": {
                "eyes": {
                    "width": 20,
                    "height": 20,
                    "variants": {
                        v: {
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "circle",
                                    "attributes": {"id": v},
                                }
                            ]
                        }
                        for v in ["a", "b", "c", "d", "e"]
                    },
                },
                "eyesRight": {"extends": "eyes"},
            },
        }
    )


def test_alias_gets_independent_variant_per_seed() -> None:
    differed = False
    for seed in ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]:
        svg = Avatar(_alias_style(), {"seed": seed}).to_string()
        matches = re.findall(r'<circle id="([a-z])"/>', svg)
        if len(matches) == 2 and matches[0] != matches[1]:
            differed = True
            break
    assert differed


def test_alias_inherits_eyes_variant_and_shares_defs_entry() -> None:
    svg = Avatar(
        _alias_style(), {"seed": "fallthrough", "eyesVariant": "b"}
    ).to_string()
    circles = re.findall(r'<circle id="([a-z])"/>', svg)
    uses = re.findall(r'<use href="#(eyes-[a-z]-[a-f0-9]+)"/>', svg)
    assert circles == ["b"]
    assert len(uses) == 2
    assert uses[0] == uses[1]


def test_alias_propagates_eyes_probability() -> None:
    svg = Avatar(
        _alias_style(), {"seed": "probability-fallthrough", "eyesProbability": 0}
    ).to_string()
    assert "<circle" not in svg


def test_alias_silently_ignores_alias_keyed_options() -> None:
    without = Avatar(
        _alias_style(), {"seed": "ignore-alias-key", "eyesVariant": "a"}
    ).to_string()
    with_ = Avatar(
        _alias_style(),
        {"seed": "ignore-alias-key", "eyesVariant": "a", "eyesRightVariant": "d"},
    ).to_string()
    assert without == with_
