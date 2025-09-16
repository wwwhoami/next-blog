export function slugify(text: any) {
  return text
    .toString() // Cast to string
    .normalize('NFKD') // Normalize accents/diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}
