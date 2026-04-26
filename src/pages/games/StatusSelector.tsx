import type { GameStatus } from "./types"

export const STATUS_OPTIONS: { value: GameStatus; label: string }[] = [
  { value: "playing",   label: "Jogando" },
  { value: "completed", label: "Zerado"  },
  { value: "backlog",   label: "Backlog" },
]

export function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status ?? "Sem status"
}

export function getStatusClasses(status: string) {
  switch (status) {
    case "playing":   return "bg-blue-100 text-blue-700 border-blue-200"
    case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "backlog":   return "bg-amber-100 text-amber-700 border-amber-200"
    default:          return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

type Props = {
  value: GameStatus
  onChange: (v: GameStatus) => void
}

export function StatusSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
            value === opt.value
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
