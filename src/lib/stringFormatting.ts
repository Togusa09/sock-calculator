function camelToDescription(text: string): string {
  const spaced = text
    // Insert space between a lowercase letter/number and an uppercase letter
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    // Insert space between consecutive uppercase letters followed by a lowercase letter (acronyms)
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export { camelToDescription };

