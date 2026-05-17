import { TASK_STATUS } from '../../utils/constants'
import PriorityBadge from '../ui/PriorityBadge'
import StatusBadge from '../ui/StatusBadge'
import LoadingSpinner from '../ui/LoadingSpinner'
import Card from '../ui/Card'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function statusAccent(status) {
  return TASK_STATUS[status]?.accent ?? 'border-l-slate-500'
}

function TaskCard({ task, onStatusChange, canEdit }) {
  return (
    <div
      className={`app-card border-l-4 p-4 sm:p-5 ${statusAccent(task.status)}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">{task.title}</p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
          )}
        </div>
        {canEdit ? (
          <select
            value={task.status}
            onChange={(e) => onStatusChange?.(task.id, e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {Object.entries(TASK_STATUS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <StatusBadge status={task.status} />
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Project</p>
          <p className="mt-0.5 text-slate-300">{task.project_name}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Assignee</p>
          <p className="mt-0.5 text-slate-300">{task.assigned_to_detail?.username ?? 'Unassigned'}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Priority</p>
          <div className="mt-1">
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Due</p>
          <p className="mt-0.5 text-slate-400">{formatDate(task.due_date)}</p>
        </div>
      </div>
    </div>
  )
}

export default function TaskTable({ tasks, loading, onStatusChange, canEditStatus }) {
  if (loading) {
    return (
      <Card padding={false} className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </Card>
    )
  }

  if (!tasks?.length) {
    return (
      <Card className="border-dashed text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-300">No tasks found</p>
        <p className="mt-2 text-sm text-slate-500">Try changing the project filter or create a new task.</p>
      </Card>
    )
  }

  const canEdit = (task) =>
    typeof canEditStatus === 'function' ? canEditStatus(task) : canEditStatus

  return (
    <>
      {/* Mobile & tablet cards */}
      <div className="space-y-3 lg:hidden">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            canEdit={canEdit(task)}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="app-card hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/60">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Task
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Project
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assignee
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Priority
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Due
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={`border-l-4 transition hover:bg-slate-800/25 ${statusAccent(task.status)}`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{task.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-300">{task.project_name}</td>
                  <td className="px-5 py-4 text-slate-300">
                    {task.assigned_to_detail?.username ?? (
                      <span className="text-slate-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-5 py-4">
                    {canEdit(task) ? (
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange?.(task.id, e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      >
                        {Object.entries(TASK_STATUS).map(([value, { label }]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={task.status} />
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(task.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
