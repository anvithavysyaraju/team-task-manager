import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { fetchProjects } from '../api/projects'
import { fetchTasks, updateTaskStatus } from '../api/tasks'
import PageHeader from '../components/layout/PageHeader'
import CreateTaskForm from '../components/tasks/CreateTaskForm'
import TaskTable from '../components/tasks/TaskTable'
import Alert from '../components/ui/Alert'
import { parseApiError } from '../utils/errors'
import { useAuth } from '../context/AuthContext'

export default function TasksPage() {
  const { user, isAdmin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const projectFilter = searchParams.get('project') || ''

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [statusSuccess, setStatusSuccess] = useState('')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const params = projectFilter ? { project: projectFilter } : {}
      const data = await fetchTasks(params)
      setTasks(data)
    } catch (err) {
      setFetchError(parseApiError(err, 'Failed to load tasks.'))
    } finally {
      setLoading(false)
    }
  }, [projectFilter])

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects()
      setProjects(data)
    } catch {
      setProjects([])
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  function canEditTask(task) {
    if (isAdmin) return true
    return task.assigned_to_detail?.id === user?.id
  }

  async function handleStatusChange(taskId, status) {
    setStatusError('')
    setStatusSuccess('')
    try {
      const updated = await updateTaskStatus(taskId, status)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
      setStatusSuccess('Task status updated.')
    } catch (err) {
      setStatusError(parseApiError(err, 'Failed to update task status.'))
      loadTasks()
    }
  }

  function handleRefresh() {
    loadTasks()
    loadProjects()
  }

  return (
    <div className="space-y-2">
      <PageHeader
        badge="Tasks"
        title="Task board"
        subtitle="Track and update work across your projects."
        actions={
          <select
            value={projectFilter}
            onChange={(e) => {
              const value = e.target.value
              if (value) setSearchParams({ project: value })
              else setSearchParams({})
            }}
            className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        }
      />

      <Alert type="error" message={fetchError} onDismiss={() => setFetchError('')} />
      <Alert type="success" message={statusSuccess} onDismiss={() => setStatusSuccess('')} />
      <Alert type="error" message={statusError} onDismiss={() => setStatusError('')} />

      {isAdmin ? (
        <CreateTaskForm
          projects={projects}
          defaultProjectId={projectFilter}
          onCreated={handleRefresh}
        />
      ) : (
        <p className="mb-6 rounded-xl border border-slate-800/80 bg-slate-900/30 px-4 py-3 text-sm text-slate-500">
          Only admins can create tasks. You can update status on tasks assigned to you.
        </p>
      )}

      <TaskTable
        tasks={tasks}
        loading={loading}
        onStatusChange={handleStatusChange}
        canEditStatus={canEditTask}
      />
    </div>
  )
}
