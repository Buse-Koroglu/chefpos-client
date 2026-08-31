const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
  return `${API_BASE_URL}${path}`
}

//  hem backend path'inden hem de url olarak resim aldığında çözümleme yapar path aldığında başına backend yolunu ekler ve tam URL oluşturur
