import api from './client'

export async function fetchProjects() {
  const { data } = await api.get('/projects/')
  return data.results ?? data
}

export async function fetchProject(id) {
  const { data } = await api.get(`/projects/${id}/`)
  return data
}

export async function createProject(payload) {
  const { data } = await api.post('/projects/', payload)
  return data
}
