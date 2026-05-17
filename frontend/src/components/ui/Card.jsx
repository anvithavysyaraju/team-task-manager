export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={[
        'app-card',
        hover && 'app-card-hover',
        padding && 'p-5 sm:p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
