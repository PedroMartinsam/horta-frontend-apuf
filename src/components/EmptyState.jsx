export default function EmptyState({ icon = '📦', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-5">{icon}</div>
      <h3 className="font-display text-xl text-apuf-text mb-2">{title}</h3>
      {description && <p className="text-apuf-muted text-sm max-w-sm leading-relaxed mb-6">{description}</p>}
      {action && action}
    </div>
  )
}
