const API_BASE_URL = 'http://localhost:8081/api/v1'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  let response
  try {
    response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options,
    })
  } catch (networkErr) {
    // Helps distinguish CORS/server-down vs auth/404
    throw new Error(`NetworkError calling ${url}: ${networkErr?.message || networkErr}`)
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  let data
  try {
    data = isJson ? await response.json() : await response.text()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = typeof data === 'string'
      ? data
      : (data && (data.message || data.error)) || 'Request failed'

    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    throw new Error(
      `HTTP ${response.status} ${response.statusText} calling ${url}: ${message}`
    )
  }

  return data
}


export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (url, data) => request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (url) => request(url, { method: 'DELETE' }),
}

export const loginUser = (credentials) => api.post('/auth/login', credentials)
export const registerUser = (payload) => api.post('/auth/register', payload)
export const getDashboardData = () => api.get('/dashboard')
export const changePassword = (payload) => api.post('/auth/change-password', payload)

export const getUsers = () => api.get('/users')
export const getMothers = () => api.get('/users/mothers')
export const getDoctors = () => api.get('/users/doctors')
export const getUser = (id) => api.get(`/users/${id}`)
export const createUser = (payload) => registerUser(payload)
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload)
export const deleteUser = (id) => api.delete(`/users/${id}`)

export const getPregnancies = () => api.get('/pregnancies')
export const getPregnanciesByMother = (motherId) => api.get(`/pregnancies/mother/${motherId}`)
export const getPregnancy = (id) => api.get(`/pregnancies/${id}`)
export const createPregnancy = (payload) => api.post('/pregnancies', payload)
export const updatePregnancy = (id, payload) => api.put(`/pregnancies/${id}`, payload)
export const deletePregnancy = (id) => api.delete(`/pregnancies/${id}`)

export const getAppointments = () => api.get('/appointments')
export const getMyAppointments = () => api.get('/appointments/my')
export const createAppointment = (payload) => api.post('/appointments', payload)
export const updateAppointmentStatus = (id, payload) => api.put(`/appointments/${id}/status`, payload)
