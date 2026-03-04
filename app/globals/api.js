import axios from "axios"

const SESSION_STORAGE_KEY = 'multishop_session'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  //baseURL: 'https://multishop-app1-production.up.railway.app',
  headers: {
    Accept: "application/json"
  }
})

function getToken() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data?.tokenCode ?? null
  } catch {
    return null
  }
}

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_STORAGE_KEY)
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default instance