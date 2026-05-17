import { useEffect, useState } from 'react'

import { createTask } from '../../api/tasks'
import { fetchUsers } from '../../api/users'
import { TASK_PRIORITY, TASK_STATUS } from '../../utils/constants'
import { parseApiError } from '../../utils/errors'
import Alert from '../ui/Alert'

const emptyForm = {
  project: '',
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigned_to_id: '',
  due_date: '',
}

export default function CreateTaskForm({ projects, onCreated, defaultProjectId = '' }) {
  const [form, setForm] = useState({ ...emptyForm, project: defaultProjectId || '' })
  const [users, setUsers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (defaultProjectId) {
      setForm((prev) => ({ ...prev, project: defaultProjectId }))
    }
  }, [defaultProjectId])

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
  }, [])

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const payload = {
        project: Number(form.project),
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
      }

      if (form.assigned_to_id) {
        payload.assigned_to_id = Number(form.assigned_to_id)
      }

      if (form.due_date) {
        payload.due_date = form.due_date
      }

      await createTask(payload)
      setForm({ ...emptyForm, project: defaultProjectId || '' })
      setSuccess('Task created successfully.')
      onCreated?.()
    } catch (err) {
      setError(parseApiError(err, 'Failed to create task.'))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

  return (
    <div className="app-card mb-8 overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-white">New task</span>
        <span className="text-slate-500">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-800/80 px-5 py-5">
          <Alert type="success" message={success} onDismiss={() => setSuccess('')} />
          <Alert type="error" message={error} onDismiss={() => setError('')} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="task-project" className="mb-1.5 block text-sm text-slate-300">
                Project <span className="text-rose-400">*</span>
              </label>
              <select
                id="task-project"
                required
                value={form.project}
                onChange={updateField('project')}
                className={inputClass}
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="task-title" className="mb-1.5 block text-sm text-slate-300">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="task-title"
                required
                value={form.title}
                onChange={updateField('title')}
                className={inputClass}
                placeholder="e.g. Design homepage mockups"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="task-desc" className="mb-1.5 block text-sm text-slate-300">
                Description
              </label>
              <textarea
                id="task-desc"
                rows={2}
                value={form.description}
                onChange={updateField('description')}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="task-status" className="mb-1.5 block text-sm text-slate-300">
                Status
              </label>
              <select
                id="task-status"
                value={form.status}
                onChange={updateField('status')}
                className={inputClass}
              >
                {Object.entries(TASK_STATUS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="mb-1.5 block text-sm text-slate-300">
                Priority
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={updateField('priority')}
                className={inputClass}
              >
                {Object.entries(TASK_PRIORITY).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-assignee" className="mb-1.5 block text-sm text-slate-300">
                Assignee
              </label>
              <select
                id="task-assignee"
                value={form.assigned_to_id}
                onChange={updateField('assigned_to_id')}
                className={inputClass}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due" className="mb-1.5 block text-sm text-slate-300">
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={form.due_date}
                onChange={updateField('due_date')}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !projects.length}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create task'}
          </button>

          {!projects.length && (
            <p className="text-xs text-amber-400/90">Create a project first before adding tasks.</p>
          )}
        </form>
      )}
    </div>
  )
}
