import api from './client'

export async function fetchTasks(params = {}) {
  const { data } = await api.get('/tasks/', { params })
  return data.results ?? data
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks/', payload)
  return data
}

export async function updateTaskStatus(id, status) {
  const { data } = await api.patch(`/tasks/${id}/`, { status })
  return data
}
