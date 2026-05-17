export default function SectionHeader({ title, action }) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="section-title">{title}</h2>
      {action}
    </div>
  )
}
