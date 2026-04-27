import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('apuf_token')
      localStorage.removeItem('apuf_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default api
