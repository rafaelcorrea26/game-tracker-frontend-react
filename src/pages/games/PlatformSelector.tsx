import { useState } from "react"
import { Input } from "@/components/ui/input"
import { KNOWN_PLATFORMS } from "./platforms"

type Props = {
  value: string
  onChange: (v: string) => void
}

export function PlatformSelector({ value, onChange }: Props) {
  const isKnown = KNOWN_PLATFORMS.some((p) => p.value === value)
  const [showCustom, setShowCustom] = useState(!isKnown && value !== "")

  const handleChip = (v: string) => {
    onChange(v)
    setShowCustom(false)
  }

  const handleOther = () => {
    if (!showCustom) onChange("")
    setShowCustom(true)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {KNOWN_PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handleChip(p.value)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              value === p.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{p.icon}</span>
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleOther}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            showCustom && !isKnown
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-dashed border-slate-300 text-slate-500 hover:bg-slate-50"
          }`}
        >
          Outra…
        </button>
      </div>

      {showCustom && (
        <Input
          placeholder="Ex: Mega Drive, SNES, PSP, Dreamcast…"
          value={isKnown ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      )}
    </div>
  )
}
