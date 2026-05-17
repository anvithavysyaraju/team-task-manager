import { useEffect, useState } from 'react'

import { createProject } from '../../api/projects'
import { fetchUsers } from '../../api/users'
import { parseApiError } from '../../utils/errors'
import Alert from '../ui/Alert'

const emptyForm = {
  name: '',
  description: '',
  member_ids: [],
}

export default function CreateProjectForm({ onCreated }) {
  const [form, setForm] = useState(emptyForm)
  const [users, setUsers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
  }, [])

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function toggleMember(userId) {
    setForm((prev) => {
      const ids = prev.member_ids.includes(userId)
        ? prev.member_ids.filter((id) => id !== userId)
        : [...prev.member_ids, userId]
      return { ...prev, member_ids: ids }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        ...(form.member_ids.length ? { member_ids: form.member_ids } : {}),
      }
      await createProject(payload)
      setForm(emptyForm)
      setSuccess('Project created successfully.')
      onCreated?.()
    } catch (err) {
      setError(parseApiError(err, 'Failed to create project.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-card mb-8 overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-white">New project</span>
        <span className="text-slate-500">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-800/80 px-5 py-5">
          <Alert type="success" message={success} onDismiss={() => setSuccess('')} />
          <Alert type="error" message={error} onDismiss={() => setError('')} />

          <div>
            <label htmlFor="project-name" className="mb-1.5 block text-sm text-slate-300">
              Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="project-name"
              required
              value={form.name}
              onChange={updateField('name')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. Website redesign"
            />
          </div>

          <div>
            <label htmlFor="project-desc" className="mb-1.5 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              id="project-desc"
              rows={3}
              value={form.description}
              onChange={updateField('description')}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="What is this project about?"
            />
          </div>

          {users.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-slate-300">Team members</p>
              <div className="flex flex-wrap gap-2">
                {users.map((u) => (
                  <label
                    key={u.id}
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition ${
                      form.member_ids.includes(u.id)
                        ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-200'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={form.member_ids.includes(u.id)}
                      onChange={() => toggleMember(u.id)}
                    />
                    {u.username}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create project'}
          </button>
        </form>
      )}
    </div>
  )
}
