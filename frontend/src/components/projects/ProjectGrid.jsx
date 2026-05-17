import ProjectCard from './ProjectCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import Card from '../ui/Card'

export default function ProjectGrid({ projects, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="app-card h-44 animate-pulse bg-slate-800/30" />
        ))}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <Card className="border-dashed py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-300">No projects yet</p>
        <p className="mt-2 text-sm text-slate-500">Projects you belong to will appear here.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
