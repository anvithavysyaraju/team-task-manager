import { Link } from 'react-router-dom'

export default function ProjectCard({ project, compact = false }) {
  const memberCount = project.members?.length ?? 0
  const initials = project.name?.slice(0, 2).toUpperCase() || 'PR'

  return (
    <Link
      to={`/tasks?project=${project.id}`}
      className="app-card app-card-hover group relative block overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-80 transition group-hover:opacity-100" />

      <div className={compact ? 'p-4 pt-5' : 'p-5 pt-6 sm:p-6 sm:pt-7'}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-violet-600/25 text-sm font-bold text-indigo-200 ring-1 ring-indigo-500/30">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-white transition group-hover:text-indigo-200 sm:text-lg">
                {project.name}
              </h3>
              <span className="shrink-0 rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/25">
                {project.task_count ?? 0}
              </span>
            </div>
            {!compact && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                {project.description || 'No description provided.'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </span>
          <span>by {project.created_by?.username ?? '—'}</span>
        </div>
      </div>
    </Link>
  )
}
