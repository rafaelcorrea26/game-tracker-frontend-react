import { type ReactNode } from "react"
import { Button } from "@/components/ui/button"

export type AppTab = "dashboard" | "games" | "assistant" | "settings"

type AppShellProps = {
  title: string
  activeTab: AppTab
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
  children: ReactNode
}

const navItems: {
  key: AppTab
  label: string
  mobileLabel: string
  icon: string
}[] = [
  { key: "dashboard", label: "Dashboard", mobileLabel: "Dashboard", icon: "📊" },
  { key: "games", label: "Jogos", mobileLabel: "Jogos", icon: "🎮" },
  { key: "assistant", label: "Assistente IA", mobileLabel: "Assistente", icon: "🤖" },
  { key: "settings", label: "Configurações", mobileLabel: "Config", icon: "⚙️" },
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
        {/* Sidebar desktop */}
        <aside className="hidden w-72 border-r bg-white lg:flex lg:flex-col">
          <div className="border-b px-6 py-6">
            <p className="text-sm font-medium text-slate-500">Workspace</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Game Tracker
            </h1>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
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

        {/* Conteúdo principal */}
        <main className="flex-1">
          <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Painel principal
                </p>
                <h2 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {title}
                </h2>
              </div>

              {/* Sair visível apenas no desktop — sidebar já tem o botão */}
              <Button
                variant="outline"
                className="hidden lg:inline-flex"
                onClick={onLogout}
              >
                Sair
              </Button>
            </div>
          </header>

          {/* pb-24 no mobile para não ficar atrás da bottom nav */}
          <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom navigation — mobile only */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const active = activeTab === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className="flex flex-col items-center gap-1 py-2 transition"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition ${
                    active ? "bg-slate-900 text-white" : "text-slate-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[11px] leading-none ${
                    active
                      ? "font-semibold text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {item.mobileLabel}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
