import { TASK_STATUS } from '../../utils/constants'
import StatusBadge from '../ui/StatusBadge'

export default function StatusBreakdown({ tasksByStatus = {}, total = 0 }) {
  const safeTotal = total || Object.values(tasksByStatus).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Object.entries(TASK_STATUS).map(([key, config]) => {
        const count = tasksByStatus[key] ?? 0
        const percent = Math.round((count / safeTotal) * 100)

        return (
          <div key={key} className="app-card p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <StatusBadge status={key} size="md" />
              <span className="text-2xl font-bold text-white">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {percent}% of tracked tasks · {config.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}
