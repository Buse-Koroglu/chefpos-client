import axios from 'axios'

export const kioskClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
