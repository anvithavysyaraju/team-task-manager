export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const TOKEN_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
}

export const TASK_STATUS = {
  todo: {
    label: 'To Do',
    dot: 'bg-slate-400',
    badge: 'bg-slate-500/15 text-slate-200 ring-slate-500/25',
    bar: 'bg-slate-500',
    accent: 'border-l-slate-500',
  },
  in_progress: {
    label: 'In Progress',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
    bar: 'bg-amber-500',
    accent: 'border-l-amber-500',
  },
  done: {
    label: 'Done',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30',
    bar: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
  },
}

export const TASK_PRIORITY = {
  low: {
    label: 'Low',
    badge: 'bg-slate-500/15 text-slate-300 ring-slate-500/25',
  },
  medium: {
    label: 'Medium',
    badge: 'bg-sky-500/15 text-sky-200 ring-sky-500/30',
  },
  high: {
    label: 'High',
    badge: 'bg-rose-500/15 text-rose-200 ring-rose-500/30',
  },
}
