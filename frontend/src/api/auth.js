import api from './client'

export async function login(username, password) {
  const { data } = await api.post('/auth/token/', { username, password })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/users/me/')
  return data
}

export async function register(userData) {
  const { data } = await api.post('/users/register/', userData)
  return data
}
