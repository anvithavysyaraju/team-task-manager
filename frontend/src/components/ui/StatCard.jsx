const icons = {
  indigo: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  sky: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ),
  amber: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
  ),
  emerald: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const accents = {
  indigo: {
    icon: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30',
    glow: 'from-indigo-500/10 via-indigo-600/5 to-transparent',
    value: 'text-indigo-50',
  },
  sky: {
    icon: 'bg-sky-500/20 text-sky-300 ring-sky-500/30',
    glow: 'from-sky-500/10 via-sky-600/5 to-transparent',
    value: 'text-sky-50',
  },
  amber: {
    icon: 'bg-amber-500/20 text-amber-300 ring-amber-500/30',
    glow: 'from-amber-500/10 via-amber-600/5 to-transparent',
    value: 'text-amber-50',
  },
  emerald: {
    icon: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30',
    glow: 'from-emerald-500/10 via-emerald-600/5 to-transparent',
    value: 'text-emerald-50',
  },
}

export default function StatCard({ label, value, hint, accent = 'indigo' }) {
  const theme = accents[accent] ?? accents.indigo

  return (
    <div className="app-card app-card-hover group relative overflow-hidden p-5 sm:p-6">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 ${theme.glow}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className={`mt-2 truncate text-3xl font-bold tracking-tight sm:text-4xl ${theme.value}`}>
            {value}
          </p>
          {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${theme.icon}`}
        >
          {icons[accent] ?? icons.indigo}
        </div>
      </div>
    </div>
  )
}
