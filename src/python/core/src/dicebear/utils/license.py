"""Attribution strings and embedded RDF/Dublin Core metadata."""

from __future__ import annotations

from ..style_def.meta import Meta
from .xml import Xml


class License:
    """Builds attribution strings and embedded RDF/Dublin Core metadata from a
    style's :class:`Meta` block.
    """

    @staticmethod
    def text(meta: Meta) -> str:
        """Return a single-line attribution string for ``<title>``/``<desc>``.

        Returns an empty string when no attribution data is available.
        """
        source_name = meta.source().name()
        source_url = meta.source().url()
        creator_name = meta.creator().name()
        license_name = meta.license().name()
        license_url = meta.license().url()

        if source_name is None and creator_name is None and license_name is None:
            return ""

        title = f"“{source_name}”" if source_name is not None else "Design"

        if source_url is not None:
            title += f" ({source_url})"

        creator = "“" + (creator_name if creator_name is not None else "Unknown") + "”"

        result = ""

        # Skip "Remix of" prefix for MIT-licensed or DiceBear-original styles.
        if (
            license_name != "MIT"
            and creator_name != "DiceBear"
            and source_name is not None
        ):
            result += "Remix of "

        result += f"{title} by {creator}"

        if license_name is not None:
            result += f", licensed under “{license_name}”"

            if license_url is not None:
                result += f" ({license_url})"

        return result

    @staticmethod
    def xml(meta: Meta) -> str:
        """Build an embedded ``<metadata>`` block with Dublin Core terms.

        Returns an empty string when no metadata fields are populated.
        """
        title = meta.source().name()
        creator_name = meta.creator().name()
        source_url = meta.source().url()
        license_url = meta.license().url()
        rights = License.text(meta)

        if (
            title is None
            and creator_name is None
            and source_url is None
            and license_url is None
            and rights == ""
        ):
            return ""

        fields: list[str] = []

        if title is not None:
            fields.append("<dc:title>" + Xml.escape(title) + "</dc:title>")

        if creator_name is not None:
            fields.append("<dc:creator>" + Xml.escape(creator_name) + "</dc:creator>")

        if source_url is not None:
            fields.append(
                '<dc:source xsi:type="dcterms:URI">'
                + Xml.escape(source_url)
                + "</dc:source>"
            )

        if license_url is not None:
            fields.append(
                '<dcterms:license xsi:type="dcterms:URI">'
                + Xml.escape(license_url)
                + "</dcterms:license>"
            )

        if rights != "":
            fields.append("<dc:rights>" + Xml.escape(rights) + "</dc:rights>")

        return (
            "<metadata"
            ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'
            ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
            ' xmlns:dc="http://purl.org/dc/elements/1.1/"'
            ' xmlns:dcterms="http://purl.org/dc/terms/">'
            "<rdf:RDF><rdf:Description>"
            + "".join(fields)
            + "</rdf:Description></rdf:RDF>"
            "</metadata>"
        )
