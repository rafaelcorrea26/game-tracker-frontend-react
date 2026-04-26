type Props = {
  title: string
  value: number
  active: boolean
  onClick: () => void
  accentClassName: string
}

export function StatCard({ title, value, active, onClick, accentClassName }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border bg-white text-left shadow-sm transition hover:shadow-md ${
        active ? "ring-2 ring-slate-900" : ""
      }`}
    >
      <div className="p-4 sm:p-5">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className={`mt-1 text-2xl font-bold sm:text-3xl ${accentClassName}`}>
          {value}
        </p>
      </div>
    </button>
  )
}
