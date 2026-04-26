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

    const avgRating =
      games.length > 0
        ? (
            games.reduce((acc, g) => acc + (g.rating ?? 0), 0) / games.length
          ).toFixed(1)
        : "0.0"

    const lastCompleted = games.filter((g) => g.status === "completed").slice(0, 3)
    const lastPlaying = games.filter((g) => g.status === "playing").slice(0, 3)

    return {
      total,
      playing,
      completed,
      backlog,
      avgRating,
      lastCompleted,
      lastPlaying,
    }
  }, [games])

  return (
    <AppShell
      title="Dashboard"
      activeTab="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold sm:text-3xl">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Jogando</p>
              <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                {stats.playing}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Zerados</p>
              <p className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                {stats.completed}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Backlog</p>
              <p className="text-2xl font-bold text-amber-600 sm:text-3xl">
                {stats.backlog}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Média</p>
              <p className="text-2xl font-bold sm:text-3xl">
                {stats.avgRating}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Jogando agora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.lastPlaying.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhum jogo em andamento
                </p>
              ) : (
                stats.lastPlaying.map((game) => (
                  <div
                    key={game.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">{game.name}</p>
                    <p className="text-sm text-slate-500">
                      Nota: {game.rating ?? 0}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Últimos zerados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.lastCompleted.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhum jogo finalizado
                </p>
              ) : (
                stats.lastCompleted.map((game) => (
                  <div
                    key={game.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">{game.name}</p>
                    <p className="text-sm text-slate-500">
                      Nota: {game.rating ?? 0}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-semibold text-slate-900">
                Quer gerenciar seus jogos?
              </p>
              <p className="text-sm text-slate-500">
                Vá para a aba de jogos para editar, filtrar e adicionar novos.
              </p>
            </div>

            <Button onClick={() => onNavigate("games")} className="w-full sm:w-auto">
              Ir para jogos
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}