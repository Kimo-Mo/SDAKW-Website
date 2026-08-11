/**
 * Converts an English string to a URL-friendly slug.
 *
 * Steps:
 *  1. Lowercase
 *  2. Normalise accented characters (é → e)
 *  3. Strip everything that is not a letter, digit, space, or hyphen
 *  4. Collapse whitespace / underscores / hyphens into a single hyphen
 *  5. Trim leading/trailing hyphens
 *
 * Examples:
 *   "Kuwait Tower Project" → "kuwait-tower-project"
 *   "Résidentiel Project"  → "residentiel-project"
 *
 * We always slug from the English version of the name, so there is no
 * need to handle Arabic characters here.
 */
const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD') // decompose accented chars (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .replace(/[^a-z0-9\s-]/g, '') // keep only letters, digits, spaces, hyphens
    .replace(/[\s_-]+/g, '-') // collapse whitespace / underscores / hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens

/**
 * Finds a unique slug for a given model collection.
 *
 * Strategy:
 *  1. Try the base slug first.
 *  2. If it exists, append -2, -3, … until a free slot is found.
 *
 * @param base   - The English string to slugify (title / name).
 * @param exists - Async function that returns true if the slug is taken.
 *                 Provide a function that queries the relevant model.
 */
export const generateUniqueSlug = async (
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> => {
  const baseSlug = toSlug(base);
  let slug = baseSlug;
  let counter = 1;

  while (await exists(slug)) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};
