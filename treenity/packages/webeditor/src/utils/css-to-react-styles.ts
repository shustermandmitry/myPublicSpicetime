/**
 *  TODO: Temporary solution to convert CSS string to React style object, will remove later
 * @param cssString - The CSS string to convert
 * @returns The React style object
 */
export default function cssToReactStyles(cssString: string): Record<string, string> {
  const styleObject: Record<string, string> = {};

  // Split the string into separate styles, taking into account possible spaces
  const styles = cssString
    .split(';')
    .map(s => s.trim())
    .filter(Boolean); // Remove empty lines

  styles.forEach(style => {
    // Find the first occurrence of a colon to separate the property and value
    const colonIndex = style.indexOf(':');
    if (colonIndex === -1) return;

    const property = style.substring(0, colonIndex).trim();
    const value = style.substring(colonIndex + 1).trim();

    if (property && value) {
      // Convert property to camelCase
      const camelCaseProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
      styleObject[camelCaseProperty] = value;
    }
  });

  return styleObject;
}
