import axios from 'axios'

/**
 * When an axios request uses `responseType: 'blob'`, error responses (4xx/5xx JSON bodies)
 * arrive as a Blob too instead of parsed JSON — this reads that blob back out as text/JSON.
 */
export async function resolveBlobErrorMessage(error: unknown, fallback: string): Promise<string> {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
    }

    const data = error.response?.data
    if (data instanceof Blob) {
      try {
        const text = await data.text()
        const parsed = JSON.parse(text) as { message?: string; title?: string }
        return parsed.message ?? parsed.title ?? fallback
      } catch {
        return fallback
      }
    }

    const message = (data as { message?: string } | undefined)?.message
    if (message) return message
  }
  return fallback
}
