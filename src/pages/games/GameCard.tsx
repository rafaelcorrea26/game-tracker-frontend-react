import type { Game } from "@/types/Game"
import { Button } from "@/components/ui/button"
import { PlatformBadge } from "./PlatformBadge"
import { getStatusLabel, getStatusClasses } from "./StatusSelector"

type Props = {
  game: Game
  onEdit: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameCard({ game, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-sm">
      {/* Plataforma + status */}
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <PlatformBadge platform={game.platform} />
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(game.status)}`}
        >
          {getStatusLabel(game.status)}
        </span>
      </div>

      {/* Nome */}
      <p className="truncate text-base font-semibold text-slate-900">
        {game.name}
      </p>

      {/* Metadados + ações */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {(game.rating ?? 0) > 0 && <span>⭐ {game.rating}/10</span>}
          {(game.year_completed ?? 0) > 0 && <span>📅 {game.year_completed}</span>}
          {game.notes?.trim() && (
            <span className="max-w-[200px] truncate sm:max-w-xs">
              💬 {game.notes}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(game)}>
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(game)}>
            Deletar
          </Button>
        </div>
      </div>
    </div>
  )
}
