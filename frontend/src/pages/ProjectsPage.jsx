import { useCallback, useEffect, useState } from 'react'

import { fetchProjects } from '../api/projects'
import PageHeader from '../components/layout/PageHeader'
import CreateProjectForm from '../components/projects/CreateProjectForm'
import ProjectGrid from '../components/projects/ProjectGrid'
import Alert from '../components/ui/Alert'
import { parseApiError } from '../utils/errors'
import { useAuth } from '../context/AuthContext'

export default function ProjectsPage() {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const data = await fetchProjects()
      setProjects(data)
    } catch (err) {
      setFetchError(parseApiError(err, 'Failed to load projects.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <div className="space-y-2">
      <PageHeader
        badge="Projects"
        title="All projects"
        subtitle="Browse project workspaces and manage team work."
      />

      <Alert type="error" message={fetchError} onDismiss={() => setFetchError('')} />

      {isAdmin ? (
        <CreateProjectForm onCreated={loadProjects} />
      ) : (
        <p className="mb-6 rounded-xl border border-slate-800/80 bg-slate-900/30 px-4 py-3 text-sm text-slate-500">
          Only admins can create projects. Contact your administrator to add one.
        </p>
      )}

      <ProjectGrid projects={projects} loading={loading} />
    </div>
  )
}
