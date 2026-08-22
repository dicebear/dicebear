using System.Collections.Generic;
using System.Text;

namespace DiceBear.Internal
{
    /// <summary>
    /// Builds attribution strings and the embedded RDF/Dublin Core metadata
    /// from a style's <see cref="Meta"/> block.
    /// </summary>
    internal static class License
    {
        /// <summary>
        /// Returns a single-line attribution string suitable for
        /// <c>&lt;title&gt;</c> or <c>&lt;desc&gt;</c> content, or an empty
        /// string when no attribution data is available.
        /// </summary>
        internal static string Text(Meta meta)
        {
            var sourceName = meta.Source().Name();
            var sourceUrl = meta.Source().Url();
            var creatorName = meta.Creator().Name();
            var licenseName = meta.License().Name();
            var licenseUrl = meta.License().Url();

            if (IsBlank(sourceName) && IsBlank(creatorName) && IsBlank(licenseName))
            {
                return string.Empty;
            }

            var title = IsBlank(sourceName) ? "Design" : "“" + sourceName + "”";

            if (!IsBlank(sourceUrl))
            {
                title += " (" + sourceUrl + ")";
            }

            var creator = "“" + (creatorName ?? "Unknown") + "”";
            var result = new StringBuilder();

            // Skip the "Remix of" prefix for MIT-licensed or DiceBear-original
            // styles.
            if (licenseName != "MIT" && creatorName != "DiceBear" && !IsBlank(sourceName))
            {
                result.Append("Remix of ");
            }

            result.Append(title).Append(" by ").Append(creator);

            if (!IsBlank(licenseName))
            {
                result.Append(", licensed under “").Append(licenseName).Append('”');

                if (!IsBlank(licenseUrl))
                {
                    result.Append(" (").Append(licenseUrl).Append(')');
                }
            }

            return result.ToString();
        }

        /// <summary>
        /// Builds an embedded <c>&lt;metadata&gt;</c> block with Dublin Core
        /// terms describing the style's source, creator, license and rights
        /// statement. Returns an empty string when no metadata fields are
        /// populated.
        /// </summary>
        internal static string Xml(Meta meta)
        {
            var title = meta.Source().Name();
            var creatorName = meta.Creator().Name();
            var sourceUrl = meta.Source().Url();
            var licenseUrl = meta.License().Url();
            var rights = Text(meta);

            if (IsBlank(title) && IsBlank(creatorName) && IsBlank(sourceUrl)
                && IsBlank(licenseUrl) && IsBlank(rights))
            {
                return string.Empty;
            }

            var fields = new List<string>();

            if (!IsBlank(title))
            {
                fields.Add("<dc:title>" + Internal.Xml.Escape(title!) + "</dc:title>");
            }

            if (!IsBlank(creatorName))
            {
                fields.Add("<dc:creator>" + Internal.Xml.Escape(creatorName!) + "</dc:creator>");
            }

            if (!IsBlank(sourceUrl))
            {
                fields.Add("<dc:source xsi:type=\"dcterms:URI\">"
                    + Internal.Xml.Escape(sourceUrl!) + "</dc:source>");
            }

            if (!IsBlank(licenseUrl))
            {
                fields.Add("<dcterms:license xsi:type=\"dcterms:URI\">"
                    + Internal.Xml.Escape(licenseUrl!) + "</dcterms:license>");
            }

            if (!IsBlank(rights))
            {
                fields.Add("<dc:rights>" + Internal.Xml.Escape(rights) + "</dc:rights>");
            }

            return "<metadata"
                + " xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\""
                + " xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""
                + " xmlns:dc=\"http://purl.org/dc/elements/1.1/\""
                + " xmlns:dcterms=\"http://purl.org/dc/terms/\">"
                + "<rdf:RDF><rdf:Description>" + string.Concat(fields) + "</rdf:Description></rdf:RDF>"
                + "</metadata>";
        }

        /// <summary>
        /// Mirrors the reference's truthiness check: an absent field and an
        /// empty string are both treated as unset.
        /// </summary>
        private static bool IsBlank(string? value) => string.IsNullOrEmpty(value);
    }
}
