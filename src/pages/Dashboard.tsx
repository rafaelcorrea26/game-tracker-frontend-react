import { useMemo } from "react"
import type { Game } from "@/types/Game"
import AppShell, { type AppTab } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type DashboardProps = {
  games: Game[]
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
}

export default function Dashboard({
  games,
  onNavigate,
  onLogout,
}: DashboardProps) {
  const stats = useMemo(() => {
    const total = games.length
    const playing = games.filter((g) => g.status === "playing").length
    const completed = games.filter((g) => g.status === "completed").length
    const backlog = games.filter((g) => g.status === "backlog").length

    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0
    const playingPct = total > 0 ? Math.round((playing / total) * 100) : 0
    const backlogPct = total > 0 ? 100 - completedPct - playingPct : 0

    const avgRating =
      games.length > 0
        ? (
            games.reduce((acc, g) => acc + (g.rating ?? 0), 0) / games.length
          ).toFixed(1)
        : "0.0"

    const topRated = [...games]
      .filter((g) => (g.rating ?? 0) > 0)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5)

    const currentlyPlaying = games
      .filter((g) => g.status === "playing")
      .slice(0, 4)

    return {
      total,
      playing,
      completed,
      backlog,
      completedPct,
      playingPct,
      backlogPct,
      avgRating,
      topRated,
      currentlyPlaying,
    }
  }, [games])

  return (
    <AppShell
      title="Dashboard"
      activeTab="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-5">

        {/* Hero: visão geral da biblioteca */}
        <div className="rounded-2xl bg-slate-900 p-5 text-white sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Biblioteca</p>
              <p className="mt-0.5 text-4xl font-bold sm:text-5xl">
                {stats.total}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {stats.total === 0
                  ? "Nenhum jogo ainda"
                  : `${stats.completedPct}% zerado${stats.completedPct !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                {stats.completed} zerado{stats.completed !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                {stats.playing} jogando
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                {stats.backlog} backlog
              </span>
            </div>
          </div>

          {/* Barra de progresso segmentada */}
          <div className="mt-5">
            {stats.total === 0 ? (
              <div className="h-2.5 rounded-full bg-slate-700" />
            ) : (
              <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-700">
                {stats.completedPct > 0 && (
                  <div
                    className="bg-emerald-400 transition-all"
                    style={{ width: `${stats.completedPct}%` }}
                  />
                )}
                {stats.playingPct > 0 && (
                  <div
                    className="bg-blue-400 transition-all"
                    style={{ width: `${stats.playingPct}%` }}
                  />
                )}
                {stats.backlogPct > 0 && (
                  <div
                    className="bg-amber-400 transition-all"
                    style={{ width: `${stats.backlogPct}%` }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stat rápidos */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Jogando", value: stats.playing, color: "text-blue-600" },
            { label: "Zerados", value: stats.completed, color: "text-emerald-600" },
            { label: "Backlog", value: stats.backlog, color: "text-amber-600" },
            { label: "Nota média", value: stats.avgRating, color: "text-slate-900" },
          ].map((s) => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Melhores avaliados + Jogando agora */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Melhores avaliados — seção exclusiva do dashboard */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span>🏆</span> Melhores avaliados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topRated.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhum jogo avaliado ainda
                </p>
              ) : (
                <ol className="space-y-2">
                  {stats.topRated.map((game, i) => (
                    <li
                      key={game.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50"
                    >
                      <span className="w-5 shrink-0 text-center text-xs font-bold text-slate-400">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                        {game.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        ⭐ {game.rating}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          {/* Jogando agora */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                </span>
                Jogando agora
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.currentlyPlaying.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">
                    Nenhum jogo em andamento
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate("games")}
                  >
                    Adicionar jogo
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {stats.currentlyPlaying.map((game) => (
                    <li
                      key={game.id}
                      className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                        {game.name}
                      </span>
                      {(game.rating ?? 0) > 0 && (
                        <span className="shrink-0 text-xs text-slate-500">
                          ⭐ {game.rating}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ação rápida */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">Gerenciar biblioteca</p>
              <p className="text-sm text-slate-500">
                Adicione, edite e filtre todos os seus jogos.
              </p>
            </div>
            <Button
              onClick={() => onNavigate("games")}
              className="w-full sm:w-auto"
            >
              Ir para jogos
            </Button>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  )
}
