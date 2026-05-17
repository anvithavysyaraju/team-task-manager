import api from './client'

export async function fetchUsers() {
  const { data } = await api.get('/users/')
  return data.results ?? data
}
