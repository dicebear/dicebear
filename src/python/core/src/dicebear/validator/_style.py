"""Validation of style definitions."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from ..errors import ErrorDetail, StyleValidationError
from ._depth import MAX_DEPTH_MESSAGE, exceeds_max_depth
from ._schema import StyleSchemaValidator


class StyleValidator:
    """Validates style definitions: the nesting limit, the shared
    ``definition.json`` schema, then the cross-references and orderings the
    schema cannot express.
    """

    @staticmethod
    def validate(data: Any) -> None:
        if exceeds_max_depth(data):
            raise StyleValidationError([{"message": MAX_DEPTH_MESSAGE}])

        StyleSchemaValidator.validate(data)

        StyleValidator._validate_aliases(data)
        StyleValidator._validate_component_cycles(data)
        StyleValidator._validate_animations(data)

    @staticmethod
    def _validate_aliases(data: dict[str, Any]) -> None:
        """Verify every ``extends`` references an existing, non-alias component.

        The schema cannot enforce cross-references between sibling keys.
        """
        components: dict[str, Any] | None = data.get("components")

        if components is None:
            return

        errors: list[ErrorDetail] = []

        for name, component in components.items():
            if not _is_alias(component):
                continue

            target = component["extends"]
            target_data = components.get(target)

            if target_data is None:
                errors.append(
                    {
                        "instancePath": f"/components/{name}/extends",
                        "message": f'references unknown component "{target}"',
                    }
                )

                continue

            if _is_alias(target_data):
                errors.append(
                    {
                        "instancePath": f"/components/{name}/extends",
                        "message": (
                            f'references alias "{target}" — '
                            "alias chains are not allowed"
                        ),
                    }
                )

        if len(errors) > 0:
            raise StyleValidationError(errors)

    @staticmethod
    def _validate_component_cycles(data: dict[str, Any]) -> None:
        """Verify no component renders itself, directly or through others.

        The renderer registers a variant's ``<defs>`` entry only after its
        body has rendered, so a cycle would recurse until the stack runs out.
        A reference to an alias counts as a reference to its source, since the
        alias renders the source's variants. Unknown names render nothing and
        close no cycle. Runs after :meth:`_validate_aliases`, so every alias
        points at a base component here.
        """
        components: dict[str, Any] | None = data.get("components")

        if components is None:
            return

        references: dict[str, list[tuple[str, str, str]]] = {}

        for name, component in components.items():
            if _is_alias(component):
                continue

            found: list[tuple[str, str, str]] = []

            def walk(
                elements: list[dict[str, Any]],
                path: str,
                found: list[tuple[str, str, str]] = found,
            ) -> None:
                for index, element in enumerate(elements):
                    element_path = f"{path}/{index}"
                    referenced = element.get("name")

                    if element.get("type") == "component" and isinstance(
                        referenced, str
                    ):
                        target = components.get(referenced)

                        if target is not None:
                            source = (
                                target["extends"] if _is_alias(target) else referenced
                            )
                            found.append((referenced, source, element_path))

                    children = element.get("children")

                    if children is not None:
                        walk(children, f"{element_path}/children", found)

            for variant_name, variant in component["variants"].items():
                walk(
                    variant["elements"],
                    f"/components/{name}/variants/{variant_name}/elements",
                )

            references[name] = found

        # Depth-first search: a reference to a component that is still on the
        # stack closes a cycle. The depth is bounded by the number of
        # components, which the schema caps well below the recursion limit.
        on_stack: set[str] = set()
        done: set[str] = set()
        errors: list[ErrorDetail] = []

        def visit(name: str) -> None:
            on_stack.add(name)

            for referenced, source, path in references.get(name, []):
                if source in on_stack:
                    errors.append(
                        {
                            "instancePath": path,
                            "message": (
                                f'references component "{referenced}", which '
                                f'leads back to "{source}" — component cycles '
                                "are not allowed"
                            ),
                        }
                    )
                elif source not in done:
                    visit(source)

            on_stack.discard(name)
            done.add(name)

        for name in references:
            if name not in done:
                visit(name)

        if len(errors) > 0:
            raise StyleValidationError(errors)

    @staticmethod
    def _validate_animations(data: dict[str, Any]) -> None:
        """Verify every animation track lists its keyframes in strictly
        ascending ``at`` order.

        The schema cannot express ordering between array items. Step jumps are
        expressed with the ``hold`` easing rather than duplicate positions.
        """
        errors: list[ErrorDetail] = []

        def visit(element: dict[str, Any], path: str) -> None:
            for animation_index, animation in enumerate(element.get("animations", [])):
                for track_name, track in animation["tracks"].items():
                    keyframes = track["keyframes"]

                    for i in range(1, len(keyframes)):
                        if keyframes[i]["at"] <= keyframes[i - 1]["at"]:
                            errors.append(
                                {
                                    "instancePath": (
                                        f"{path}/animations/{animation_index}"
                                        f"/tracks/{track_name}/keyframes/{i}/at"
                                    ),
                                    "message": (
                                        "must be greater than the previous keyframe"
                                    ),
                                }
                            )

        _visit_elements(data, visit)

        if len(errors) > 0:
            raise StyleValidationError(errors)


def _visit_elements(
    data: dict[str, Any], visit: Callable[[dict[str, Any], str], None]
) -> None:
    """Walk every element in the definition — the canvas tree and every
    component variant tree — and invoke ``visit`` with the element and its
    JSON pointer path.
    """

    def walk(elements: list[dict[str, Any]], path: str) -> None:
        for index, element in enumerate(elements):
            element_path = f"{path}/{index}"

            visit(element, element_path)
            walk(element.get("children", []), f"{element_path}/children")

    walk(data["canvas"]["elements"], "/canvas/elements")

    for name, component in data.get("components", {}).items():
        if _is_alias(component):
            continue

        for variant_name, variant in component["variants"].items():
            walk(
                variant["elements"],
                f"/components/{name}/variants/{variant_name}/elements",
            )


def _is_alias(data: dict[str, Any]) -> bool:
    return "extends" in data
