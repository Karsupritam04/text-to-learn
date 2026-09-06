import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

/** Call once from a component (e.g. App) after Auth0 is ready to attach the access token to every request. */
export function setAuthTokenGetter(getTokenFn) {
  api.interceptors.request.clear?.()
  api.interceptors.request.use(async (config) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn()
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {
        // not authenticated yet - request goes out unauthenticated, backend decides what's allowed
      }
    }
    return config
  })
}

function normalizeError(error) {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong talking to the server.'
  return new Error(message)
}

export const courseApi = {
  list: async () => {
    try {
      const { data } = await api.get('/api/courses')
      return data
    } catch (e) { throw normalizeError(e) }
  },
  mine: async () => {
    try {
      const { data } = await api.get('/api/user-courses')
      return data
    } catch (e) { throw normalizeError(e) }
  },
  get: async (courseId) => {
    try {
      const { data } = await api.get(`/api/courses/${courseId}`)
      return data
    } catch (e) { throw normalizeError(e) }
  },
  generate: async (topic) => {
    try {
      const { data } = await api.post('/api/generate-course', { topic })
      return data
    } catch (e) { throw normalizeError(e) }
  },
  remove: async (courseId) => {
    try {
      await api.delete(`/api/courses/${courseId}`)
    } catch (e) { throw normalizeError(e) }
  },
}

export const lessonApi = {
  get: async (lessonId) => {
    try {
      const { data } = await api.get(`/api/lessons/${lessonId}`)
      return data
    } catch (e) { throw normalizeError(e) }
  },
}

export const youtubeApi = {
  search: async (query, maxResults = 1) => {
    try {
      const { data } = await api.get('/api/youtube', { params: { query, maxResults } })
      return data
    } catch (e) { throw normalizeError(e) }
  },
}

export const narrationApi = {
  narrate: async (text, voiceName) => {
    try {
      const { data } = await api.post('/api/narrate', { text, voiceName })
      return data
    } catch (e) { throw normalizeError(e) }
  },
}
