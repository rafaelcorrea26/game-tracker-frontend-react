import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { searchGames, rawgConfigured, type RawgResult } from "@/services/rawg"

type Props = {
  value: string
  onChange: (v: string) => void
  onSelect: (game: RawgResult) => void
}

export function GameSearch({ value, onChange, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<RawgResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (value.length < 2) { setSuggestions([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        const results = await searchGames(value)
        setSuggestions(results)
        setOpen(results.length > 0)
        setActiveIdx(-1)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [value])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const pick = (game: RawgResult) => {
    onSelect(game)
    setOpen(false)
    setSuggestions([])
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
    if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]) }
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder={rawgConfigured() ? "Busque o nome do jogo…" : "Nome do jogo"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          buscando…
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg" style={{ maxHeight: 260 }}>
          {suggestions.map((g, i) => (
            <li
              key={g.name + i}
              onMouseDown={() => pick(g)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition ${
                i === activeIdx ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              {g.image && (
                <img src={g.image} alt="" className="h-8 w-12 flex-shrink-0 rounded object-cover" />
              )}
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{g.name}</p>
                {(g.platform || g.year) && (
                  <p className="text-xs text-slate-400">{[g.platform, g.year].filter(Boolean).join(" · ")}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
