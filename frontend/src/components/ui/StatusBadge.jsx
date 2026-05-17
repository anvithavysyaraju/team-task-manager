import { TASK_STATUS } from '../../utils/constants'

export default function StatusBadge({ status, size = 'md' }) {
  const config = TASK_STATUS[status] ?? {
    label: status,
    dot: 'bg-slate-400',
    badge: 'bg-slate-500/15 text-slate-200 ring-slate-500/25',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ring-inset ${config.badge} ${sizes[size]}`}
    >
      <span className={`shrink-0 rounded-full ${config.dot} ${size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2'}`} />
      {config.label}
    </span>
  )
}
