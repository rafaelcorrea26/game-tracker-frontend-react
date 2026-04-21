import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

export type AppTab = "dashboard" | "games" | "assistant" | "settings"

type AppShellProps = {
  title: string
  activeTab: AppTab
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
  children: ReactNode
}

const items: { key: AppTab; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "games", label: "Jogos", icon: "🎮" },
  { key: "assistant", label: "Assistente IA", icon: "🤖" },
  { key: "settings", label: "Configurações", icon: "⚙️" },
]

export default function AppShell({
  title,
  activeTab,
  onNavigate,
  onLogout,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r bg-white lg:flex lg:flex-col">
          <div className="border-b px-6 py-6">
            <p className="text-sm font-medium text-slate-500">Workspace</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Game Tracker
            </h1>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {items.map((item) => {
              const active = activeTab === item.key

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="border-t p-4">
            <Button variant="outline" className="w-full" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Painel principal
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {title}
                </h2>
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <Button variant="outline" onClick={onLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}