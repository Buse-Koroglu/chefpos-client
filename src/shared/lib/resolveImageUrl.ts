const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Resolves a product image value returned by the backend into a fully qualified URL.
 * New uploads come back as a relative path (e.g. "/uploads/products/{id}.webp") that needs
 * the API origin prefixed. Pre-migration records may still hold an absolute externally-hosted
 * URL — those are returned as-is so existing images keep rendering.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
  return `${API_BASE_URL}${path}`
}
