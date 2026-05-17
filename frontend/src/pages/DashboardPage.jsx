import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchDashboard } from '../api/dashboard'
import { fetchProjects } from '../api/projects'
import StatusBreakdown from '../components/dashboard/StatusBreakdown'
import PageHeader from '../components/layout/PageHeader'
import ProjectCard from '../components/projects/ProjectCard'
import TaskTable from '../components/tasks/TaskTable'
import Alert from '../components/ui/Alert'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import { parseApiError } from '../utils/errors'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    async function load() {
      setFetchError('')
      try {
        const [dash, projectList] = await Promise.all([
          fetchDashboard(),
          fetchProjects(),
        ])
        setDashboard(dash)
        setProjects(projectList.slice(0, 4))
      } catch (err) {
        setFetchError(parseApiError(err, 'Failed to load dashboard.'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const displayName = user?.first_name || user?.username

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        badge="Dashboard"
        title={`Welcome back, ${displayName}`}
        subtitle="Track projects, monitor task progress, and stay on top of your team's workload."
      />

      <Alert type="error" message={fetchError} onDismiss={() => setFetchError('')} />

      <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/80 to-violet-600/5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300/90">Workspace snapshot</p>
            <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              {dashboard?.task_count ?? '—'} active tasks across{' '}
              {dashboard?.project_count ?? '—'} projects
            </p>
            <p className="mt-2 text-sm text-slate-400">
              You have {dashboard?.my_assigned_task_count ?? 0} task
              {(dashboard?.my_assigned_task_count ?? 0) !== 1 ? 's' : ''} assigned to you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              View projects
            </Link>
            <Link
              to="/tasks"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Manage tasks
            </Link>
          </div>
        </div>
      </Card>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          <StatCard label="Projects" value={dashboard?.project_count ?? '—'} accent="indigo" />
          <StatCard label="Total tasks" value={dashboard?.task_count ?? '—'} accent="sky" />
          <StatCard
            label="My assigned"
            value={dashboard?.my_assigned_task_count ?? '—'}
            accent="amber"
          />
          <StatCard
            label="Your role"
            value={dashboard?.role ?? user?.role ?? '—'}
            hint="Workspace access level"
            accent="emerald"
          />
        </div>
      </section>

      {dashboard?.tasks_by_status && (
        <section>
          <SectionHeader title="Tasks by status" />
          <StatusBreakdown
            tasksByStatus={dashboard.tasks_by_status}
            total={dashboard.task_count}
          />
        </section>
      )}

      <section className="grid gap-8 xl:grid-cols-5 xl:gap-10">
        <div className="xl:col-span-3">
          <SectionHeader
            title="Recent tasks"
            action={
              <Link to="/tasks" className="section-link">
                View all →
              </Link>
            }
          />
          <TaskTable tasks={dashboard?.recent_tasks ?? []} loading={loading} />
        </div>

        <div className="xl:col-span-2">
          <SectionHeader
            title="Projects"
            action={
              <Link to="/projects" className="section-link">
                View all →
              </Link>
            }
          />
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="app-card h-28 animate-pulse bg-slate-800/40" />
              ))}
            </div>
          ) : projects.length ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} compact />
              ))}
            </div>
          ) : (
            <Card className="text-center text-sm text-slate-500">No projects yet.</Card>
          )}
        </div>
      </section>
    </div>
  )
}
