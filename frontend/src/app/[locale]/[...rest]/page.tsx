import { notFound } from "next/navigation"

/**
 * Catches unknown routes within a locale (e.g. /ar/anything-unknown) and
 * renders the localized [locale]/not-found page (see next-intl docs).
 */
export default function CatchAllPage() {
  notFound()
}