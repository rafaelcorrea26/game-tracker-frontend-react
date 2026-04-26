import { useMemo, useState } from "react"
import { Search } from "lucide-react"
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

import { StatCard } from "./StatCard"
import { GameCard } from "./GameCard"
import { GameForm } from "./GameForm"
import { KNOWN_PLATFORMS } from "./platforms"
import type { GameStatus, FilterStatus, SortKey, GameBody } from "./types"

type Props = {
  games: Game[]
  loading: boolean
  onRefreshGames: () => Promise<void>
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
}

export default function Games({ games, loading, onRefreshGames, onNavigate, onLogout }: Props) {
  const currentYear = new Date().getFullYear()
  const { toast } = useToast()

  // ── Criar ──────────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createName, setCreateName] = useState("")
  const [createStatus, setCreateStatus] = useState<GameStatus>("playing")
  const [createPlatform, setCreatePlatform] = useState("")
  const [createYear, setCreateYear] = useState(String(currentYear))
  const [createRating, setCreateRating] = useState("10")
  const [createNotes, setCreateNotes] = useState("")

  // ── Editar ─────────────────────────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editStatus, setEditStatus] = useState<GameStatus>("playing")
  const [editPlatform, setEditPlatform] = useState("")
  const [editYear, setEditYear] = useState("")
  const [editRating, setEditRating] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  // ── Deletar ────────────────────────────────────────────────────────────────
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletingName, setDeletingName] = useState("")
  const [deleting, setDeleting] = useState(false)

  // ── Filtros e ordenação ────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortKey>("default")

  // ── Handlers ───────────────────────────────────────────────────────────────
  const resetCreate = () => {
    setCreateName("")
    setCreateStatus("playing")
    setCreatePlatform("")
    setCreateYear(String(currentYear))
    setCreateRating("10")
    setCreateNotes("")
  }

  const createGame = async () => {
    if (!createName.trim()) {
      toast({ title: "Campo obrigatório", description: "Digite o nome do jogo", variant: "destructive" })
      return
    }
    try {
      setSaving(true)
      await api<Game, GameBody>("/games", "POST", {
        name: createName, status: createStatus, platform: createPlatform,
        year_completed: Number(createYear), rating: Number(createRating), notes: createNotes,
      })
      await onRefreshGames()
      resetCreate()
      setOpen(false)
      toast({ title: "Adicionado 🎮", description: "Jogo criado com sucesso" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível criar o jogo", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (game: Game) => {
    setEditingId(game.id)
    setEditName(game.name)
    setEditStatus((game.status as GameStatus) || "playing")
    setEditPlatform(game.platform ?? "")
    setEditYear(game.year_completed ? String(game.year_completed) : "")
    setEditRating(game.rating != null ? String(game.rating) : "")
    setEditNotes(game.notes ?? "")
    setEditOpen(true)
  }

  const updateGame = async () => {
    if (!editingId || !editName.trim()) {
      toast({ title: "Campo obrigatório", description: "Digite o nome do jogo", variant: "destructive" })
      return
    }
    try {
      setUpdating(true)
      await api<Game, GameBody>(`/games/${editingId}`, "PUT", {
        name: editName, status: editStatus, platform: editPlatform,
        year_completed: editYear ? Number(editYear) : 0,
        rating: editRating ? Number(editRating) : 0,
        notes: editNotes,
      })
      await onRefreshGames()
      setEditOpen(false)
      setEditingId(null)
      toast({ title: "Atualizado", description: "Jogo atualizado com sucesso" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível atualizar o jogo", variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  const openDelete = (game: Game) => {
    setDeletingId(game.id)
    setDeletingName(game.name)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      setDeleting(true)
      await api<void>(`/games/${deletingId}`, "DELETE")
      await onRefreshGames()
      setDeleteOpen(false)
      setDeletingId(null)
      setDeletingName("")
      toast({ title: "Removido", description: "Jogo deletado com sucesso" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Erro ao deletar", variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  // ── Dados derivados ────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     games.length,
    playing:   games.filter((g) => g.status === "playing").length,
    completed: games.filter((g) => g.status === "completed").length,
    backlog:   games.filter((g) => g.status === "backlog").length,
  }), [games])

  const platformsInLibrary = useMemo(() => {
    const set = new Set<string>()
    games.forEach((g) => { if (g.platform) set.add(g.platform) })
    return [...set].sort((a, b) => a.localeCompare(b, "pt"))
  }, [games])

  const filteredGames = useMemo(() => {
    const q = search.trim().toLowerCase()

    let list = games.filter((g) => {
      const statusOk   = filterStatus   === "all" || g.status   === filterStatus
      const platformOk = filterPlatform === "all" || g.platform === filterPlatform
      const searchOk   = !q
        || g.name.toLowerCase().includes(q)
        || (g.notes    ?? "").toLowerCase().includes(q)
        || (g.platform ?? "").toLowerCase().includes(q)
      return statusOk && platformOk && searchOk
    })

    if (sortBy === "name")   list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt"))
    if (sortBy === "rating") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    if (sortBy === "year")   list = [...list].sort((a, b) => (b.year_completed ?? 0) - (a.year_completed ?? 0))

    return list
  }, [games, filterStatus, filterPlatform, search, sortBy])

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell title="Meus Jogos" activeTab="games" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl bg-slate-200" />)}
          </div>
          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Meus Jogos" activeTab="games" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-5">

        {/* Busca + ordenação */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Buscar por nome, plataforma ou observações…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white shadow-sm pl-9"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="default">Ordem padrão</option>
            <option value="name">Nome (A–Z)</option>
            <option value="rating">Maior nota</option>
            <option value="year">Ano (recente)</option>
          </select>
        </div>

        {/* Filtro por status */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard title="Todos"   value={stats.total}     active={filterStatus === "all"}       onClick={() => setFilterStatus("all")}       accentClassName="text-slate-900"   />
          <StatCard title="Jogando" value={stats.playing}   active={filterStatus === "playing"}   onClick={() => setFilterStatus("playing")}   accentClassName="text-blue-600"    />
          <StatCard title="Zerados" value={stats.completed} active={filterStatus === "completed"} onClick={() => setFilterStatus("completed")} accentClassName="text-emerald-600" />
          <StatCard title="Backlog" value={stats.backlog}   active={filterStatus === "backlog"}   onClick={() => setFilterStatus("backlog")}   accentClassName="text-amber-600"   />
        </div>

        {/* Filtro por plataforma */}
        {platformsInLibrary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterPlatform("all")}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filterPlatform === "all"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todas
            </button>
            {platformsInLibrary.map((p) => {
              const known = KNOWN_PLATFORMS.find((k) => k.value === p)
              const active = filterPlatform === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPlatform(active ? "all" : p)}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {known && <span>{known.icon}</span>}
                  {p}
                </button>
              )
            })}
          </div>
        )}

        {/* Biblioteca */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Sua biblioteca
                {filteredGames.length !== stats.total && (
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({filteredGames.length} de {stats.total})
                  </span>
                )}
              </CardTitle>

              <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) resetCreate() }}>
                <DialogTrigger>
                  <Button size="sm">+ Novo jogo</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto bg-white shadow-2xl">
                  <DialogHeader><DialogTitle>Novo jogo</DialogTitle></DialogHeader>
                  <GameForm
                    name={createName} setName={setCreateName}
                    status={createStatus} setStatus={setCreateStatus}
                    platform={createPlatform} setPlatform={setCreatePlatform}
                    yearCompleted={createYear} setYearCompleted={setCreateYear}
                    rating={createRating} setRating={setCreateRating}
                    notes={createNotes} setNotes={setCreateNotes}
                    onSubmit={() => void createGame()}
                    submitting={saving}
                    submitLabel="Adicionar jogo"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {filteredGames.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="font-medium text-slate-700">Nenhum jogo encontrado</p>
                <p className="mt-1 text-sm text-slate-500">Ajuste o filtro ou adicione novos jogos.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} onEdit={openEdit} onDelete={openDelete} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal editar */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto bg-white shadow-2xl">
            <DialogHeader><DialogTitle>Editar jogo</DialogTitle></DialogHeader>
            <GameForm
              name={editName} setName={setEditName}
              status={editStatus} setStatus={setEditStatus}
              platform={editPlatform} setPlatform={setEditPlatform}
              yearCompleted={editYear} setYearCompleted={setEditYear}
              rating={editRating} setRating={setEditRating}
              notes={editNotes} setNotes={setEditNotes}
              onSubmit={() => void updateGame()}
              submitting={updating}
              submitLabel="Salvar alterações"
            />
          </DialogContent>
        </Dialog>

        {/* Modal deletar */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm bg-white shadow-2xl">
            <DialogHeader><DialogTitle>Excluir jogo</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Tem certeza que deseja excluir{" "}
                <span className="font-semibold text-slate-900">{deletingName}</span>?
                Essa ação não pode ser desfeita.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={() => void confirmDelete()} disabled={deleting} className="w-full sm:w-auto">
                  {deleting ? "Excluindo…" : "Excluir"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  )
}
