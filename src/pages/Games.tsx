import { useEffect, useMemo, useState } from "react"
import { api } from "@/services/api"
import type { Game } from "@/types/Game"

import AppShell, { type AppTab } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type GameStatus = "playing" | "completed" | "backlog"
type FilterStatus = "all" | GameStatus

type GamesProps = {
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
}

function getStatusLabel(status: string) {
  switch (status) {
    case "playing":
      return "Jogando"
    case "completed":
      return "Zerado"
    case "backlog":
      return "Backlog"
    default:
      return status || "Sem status"
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "playing":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "backlog":
      return "bg-amber-100 text-amber-700 border-amber-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

type CreateGameBody = {
  name: string
  status: string
  year_completed?: number
  rating?: number
  notes?: string
}

type UpdateGameBody = {
  name: string
  status: string
  year_completed?: number
  rating?: number
  notes?: string
}

type StatusOption = {
  value: GameStatus
  label: string
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerado" },
  { value: "backlog", label: "Backlog" },
]

type StatusSelectorProps = {
  value: GameStatus
  onChange: (value: GameStatus) => void
}

function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {STATUS_OPTIONS.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

type StatCardProps = {
  title: string
  value: number
  active: boolean
  onClick: () => void
  accentClassName: string
}

function StatCard({
  title,
  value,
  active,
  onClick,
  accentClassName,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border bg-white text-left shadow-sm transition hover:shadow-md ${
        active ? "ring-2 ring-slate-900" : ""
      }`}
    >
      <div className="p-6">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${accentClassName}`}>{value}</p>
      </div>
    </button>
  )
}

export default function Games({ onNavigate, onLogout }: GamesProps) {
  const currentYear = new Date().getFullYear()

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [createName, setCreateName] = useState("")
  const [createStatus, setCreateStatus] = useState<GameStatus>("playing")
  const [createYearCompleted, setCreateYearCompleted] = useState(String(currentYear))
  const [createRating, setCreateRating] = useState("10")
  const [createNotes, setCreateNotes] = useState("")

  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editStatus, setEditStatus] = useState<GameStatus>("playing")
  const [editYearCompleted, setEditYearCompleted] = useState("")
  const [editRating, setEditRating] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletingName, setDeletingName] = useState("")
  const [deleting, setDeleting] = useState(false)

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [search, setSearch] = useState("")

  const { toast } = useToast()

  const loadGames = async () => {
    try {
      const data = await api<Game[]>("/games")
      setGames(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setGames([])
      toast({
        title: "Erro",
        description: "Não foi possível carregar os jogos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetCreateForm = () => {
    setCreateName("")
    setCreateStatus("playing")
    setCreateYearCompleted(String(currentYear))
    setCreateRating("10")
    setCreateNotes("")
  }

  const createGame = async () => {
    if (!createName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o nome do jogo",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const payload: CreateGameBody = {
        name: createName,
        status: createStatus,
        year_completed: Number(createYearCompleted),
        rating: Number(createRating),
        notes: createNotes,
      }

      const newGame = await api<Game, CreateGameBody>("/games", "POST", payload)

      setGames((prev) => [newGame, ...prev])
      resetCreateForm()
      setOpen(false)

      toast({
        title: "Adicionado 🎮",
        description: "Jogo criado com sucesso",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro",
        description: "Não foi possível criar o jogo",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (game: Game) => {
    setEditingId(game.id)
    setEditName(game.name)
    setEditStatus((game.status as GameStatus) || "playing")
    setEditYearCompleted(
      game.year_completed !== undefined && game.year_completed !== null
        ? String(game.year_completed)
        : ""
    )
    setEditRating(
      game.rating !== undefined && game.rating !== null
        ? String(game.rating)
        : ""
    )
    setEditNotes(game.notes ?? "")
    setEditOpen(true)
  }

  const updateGame = async () => {
    if (!editingId) return

    if (!editName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o nome do jogo",
        variant: "destructive",
      })
      return
    }

    try {
      setUpdating(true)

      const payload: UpdateGameBody = {
        name: editName,
        status: editStatus,
        year_completed: editYearCompleted ? Number(editYearCompleted) : 0,
        rating: editRating ? Number(editRating) : 0,
        notes: editNotes,
      }

      const updatedGame = await api<Game, UpdateGameBody>(
        `/games/${editingId}`,
        "PUT",
        payload
      )

      setGames((prev) =>
        prev.map((game) => (game.id === updatedGame.id ? updatedGame : game))
      )

      setEditOpen(false)
      setEditingId(null)

      toast({
        title: "Atualizado",
        description: "Jogo atualizado com sucesso",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o jogo",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const openDeleteModal = (game: Game) => {
    setDeletingId(game.id)
    setDeletingName(game.name)
    setDeleteOpen(true)
  }

  const confirmDeleteGame = async () => {
    if (!deletingId) return

    try {
      setDeleting(true)

      await api<void>(`/games/${deletingId}`, "DELETE")
      setGames((prev) => prev.filter((g) => g.id !== deletingId))

      setDeleteOpen(false)
      setDeletingId(null)
      setDeletingName("")

      toast({
        title: "Removido",
        description: "Jogo deletado com sucesso",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro",
        description: "Erro ao deletar",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    loadGames()
  }, [])

  const stats = useMemo(() => {
    return {
      total: games.length,
      playing: games.filter((g) => g.status === "playing").length,
      completed: games.filter((g) => g.status === "completed").length,
      backlog: games.filter((g) => g.status === "backlog").length,
    }
  }, [games])

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesStatus =
        filterStatus === "all" ? true : game.status === filterStatus

      const normalizedSearch = search.trim().toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : game.name.toLowerCase().includes(normalizedSearch) ||
            (game.notes ?? "").toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [games, filterStatus, search])

  if (loading) {
    return (
      <AppShell
        title="Meus Jogos"
        activeTab="games"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="animate-pulse space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
          </div>
          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Meus Jogos"
      activeTab="games"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value)
              if (value) resetCreateForm()
            }}
          >
            <DialogTrigger>
              <Button className="shadow-sm">Novo jogo</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md bg-white opacity-100 shadow-2xl">
              <DialogHeader>
                <DialogTitle>Novo jogo</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nome do jogo
                  </label>
                  <Input
                    placeholder="Nome do jogo"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <StatusSelector
                    value={createStatus}
                    onChange={setCreateStatus}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Ano de conclusão
                    </label>
                    <Input
                      type="number"
                      value={createYearCompleted}
                      onChange={(e) => setCreateYearCompleted(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Nota
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={createRating}
                      onChange={(e) => setCreateRating(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Observações
                  </label>
                  <textarea
                    placeholder="Escreva observações sobre o jogo..."
                    value={createNotes}
                    onChange={(e) => setCreateNotes(e.target.value)}
                    className="min-h-[110px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
                  />
                </div>

                <Button
                  onClick={createGame}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? "Salvando..." : "Adicionar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Todos"
            value={stats.total}
            active={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
            accentClassName="text-slate-900"
          />
          <StatCard
            title="Jogando"
            value={stats.playing}
            active={filterStatus === "playing"}
            onClick={() => setFilterStatus("playing")}
            accentClassName="text-blue-600"
          />
          <StatCard
            title="Zerados"
            value={stats.completed}
            active={filterStatus === "completed"}
            onClick={() => setFilterStatus("completed")}
            accentClassName="text-emerald-600"
          />
          <StatCard
            title="Backlog"
            value={stats.backlog}
            active={filterStatus === "backlog"}
            onClick={() => setFilterStatus("backlog")}
            accentClassName="text-amber-600"
          />
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg">Sua biblioteca</CardTitle>

              <div className="flex flex-col gap-3 md:w-[320px]">
                <Input
                  placeholder="Buscar por nome ou observações"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {filteredGames.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="text-base font-medium text-slate-700">
                  Nenhum jogo encontrado
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Ajuste o filtro ou adicione novos jogos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {game.name}
                        </p>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            game.status
                          )}`}
                        >
                          {getStatusLabel(game.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>Nota: {game.rating ?? 0}</span>
                        <span>Ano: {game.year_completed ?? "-"}</span>
                        <span>
                          {game.notes?.trim()
                            ? `Observação: ${game.notes}`
                            : "Sem observações"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openEditModal(game)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => openDeleteModal(game)}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-md bg-white opacity-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Editar jogo</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Nome do jogo
                </label>
                <Input
                  placeholder="Nome do jogo"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <StatusSelector value={editStatus} onChange={setEditStatus} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Ano de conclusão
                  </label>
                  <Input
                    type="number"
                    value={editYearCompleted}
                    onChange={(e) => setEditYearCompleted(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nota
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Observações
                </label>
                <textarea
                  placeholder="Escreva um resumo da experiência, progresso ou observações..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="min-h-[110px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
                />
              </div>

              <Button
                onClick={updateGame}
                disabled={updating}
                className="w-full"
              >
                {updating ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm bg-white opacity-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Excluir jogo</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Tem certeza que deseja excluir{" "}
                <span className="font-semibold text-slate-900">
                  {deletingName}
                </span>
                ? Essa ação não pode ser desfeita.
              </p>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                >
                  Cancelar
                </Button>

                <Button
                  variant="destructive"
                  onClick={confirmDeleteGame}
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}