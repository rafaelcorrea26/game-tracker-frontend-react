import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusSelector } from "./StatusSelector"
import { PlatformSelector } from "./PlatformSelector"
import { GameSearch } from "./GameSearch"
import type { RawgResult } from "@/services/rawg"
import type { GameStatus } from "./types"

type Props = {
  name: string
  setName: (v: string) => void
  status: GameStatus
  setStatus: (v: GameStatus) => void
  platform: string
  setPlatform: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  rating: string
  setRating: (v: string) => void
  notes: string
  setNotes: (v: string) => void
  onSubmit: () => void
  submitting: boolean
  submitLabel: string
}

export function GameForm({
  name, setName,
  status, setStatus,
  platform, setPlatform,
  startDate, setStartDate,
  endDate, setEndDate,
  rating, setRating,
  notes, setNotes,
  onSubmit,
  submitting,
  submitLabel,
}: Props) {
  const handleGameSelect = (game: RawgResult) => {
    setName(game.name)
    if (game.platform) setPlatform(game.platform)
  }

  const dateError = useMemo(() => {
    if (startDate && endDate && startDate > endDate)
      return "A data de início não pode ser maior que a data de conclusão"
    return null
  }, [startDate, endDate])

  const handleStartDateChange = (v: string) => {
    setStartDate(v)
    if (endDate && v && v > endDate) setEndDate("")
  }

  const handleEndDateChange = (v: string) => {
    setEndDate(v)
    if (startDate && v && v < startDate) setStartDate("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Nome do jogo</label>
        <GameSearch value={name} onChange={setName} onSelect={handleGameSelect} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Status</label>
        <StatusSelector value={status} onChange={setStatus} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Plataforma</label>
        <PlatformSelector value={platform} onChange={setPlatform} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Data de início</label>
          <Input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Data de conclusão</label>
          <Input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>
      </div>

      {dateError && (
        <p className="text-xs text-red-600">{dateError}</p>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Nota (0–10)</label>
        <Input
          type="number"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Observações</label>
        <textarea
          placeholder="Escreva observações sobre o jogo…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[90px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm outline-none focus:border-slate-400 md:text-sm"
        />
      </div>

      <Button onClick={onSubmit} disabled={submitting || !!dateError} className="w-full">
        {submitting ? "Salvando…" : submitLabel}
      </Button>
    </div>
  )
}
