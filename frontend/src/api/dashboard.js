import api from './client'

export async function fetchDashboard() {
  const { data } = await api.get('/dashboard/')
  return data
}
