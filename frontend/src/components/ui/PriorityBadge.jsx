import { TASK_PRIORITY } from '../../utils/constants'

export default function PriorityBadge({ priority }) {
  const config = TASK_PRIORITY[priority] ?? {
    label: priority,
    badge: 'bg-slate-500/15 text-slate-300 ring-slate-500/25',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${config.badge}`}
    >
      {config.label}
    </span>
  )
}
