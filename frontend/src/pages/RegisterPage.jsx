import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register(form)
      await login(form.username, form.password)
      navigate('/', { replace: true })
    } catch (err) {
      const data = err.response?.data
      const message =
        (typeof data === 'object' &&
          Object.entries(data || {})
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' · ')) ||
        'Registration failed. Please check your details.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300">
          ← Back to sign in
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-white">Create an account</h1>
        <p className="mt-1 text-sm text-slate-500">Join your team workspace</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-300">First name</label>
              <input
                value={form.first_name}
                onChange={updateField('first_name')}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-300">Last name</label>
              <input
                value={form.last_name}
                onChange={updateField('last_name')}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Username</label>
            <input
              required
              value={form.username}
              onChange={updateField('username')}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={updateField('email')}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={updateField('password')}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-400 hover:to-violet-500 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
