import { useEffect, useRef, useState } from "react"
import { api } from "@/services/api"
import type { Game } from "@/types/Game"

import Login from "./pages/Login"
import Games from "./pages/games/Games"
import Dashboard from "./pages/Dashboard"
import Assistant from "./pages/Assistant"
import Settings from "./pages/Settings"
import type { AppTab } from "@/components/layout/AppShell"

const GAMES_CACHE_KEY = "gt_games_cache"

function readCache(): Game[] {
  try {
    const raw = localStorage.getItem(GAMES_CACHE_KEY)
    return raw ? (JSON.parse(raw) as Game[]) : []
  } catch {
    return []
  }
}

function writeCache(games: Game[]) {
  try {
    localStorage.setItem(GAMES_CACHE_KEY, JSON.stringify(games))
  } catch {}
}

export default function App() {
  const [token] = useState<string | null>(() => localStorage.getItem("token"))
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard")
  const [mountedTabs, setMountedTabs] = useState<Set<AppTab>>(() => new Set<AppTab>(["dashboard"]))

  const [games, setGames] = useState<Game[]>(() => (token ? readCache() : []))
  const [loadingGames, setLoadingGames] = useState(false)

  const hasCachedData = useRef(token ? readCache().length > 0 : false)

  useEffect(() => {
    if (!token) return

    const loadGames = async () => {
      try {
        if (!hasCachedData.current) setLoadingGames(true)
        const data = await api<Game[]>("/games")
        const fresh = Array.isArray(data) ? data : []
        setGames(fresh)
        writeCache(fresh)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingGames(false)
      }
    }

    void loadGames()
  }, [token])

  const handleNavigate = (tab: AppTab) => {
    setMountedTabs((prev) => new Set([...prev, tab]))
    setActiveTab(tab)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem(GAMES_CACHE_KEY)
    window.location.reload()
  }

  const refreshGames = async () => {
    try {
      const data = await api<Game[]>("/games")
      const fresh = Array.isArray(data) ? data : []
      setGames(fresh)
      writeCache(fresh)
    } catch (err) {
      console.error(err)
    }
  }

  if (!token) {
    return <Login />
  }

  return (
    <>
      <div className={activeTab !== "dashboard" ? "hidden" : ""}>
        <Dashboard
          games={games}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {mountedTabs.has("games") && (
        <div className={activeTab !== "games" ? "hidden" : ""}>
          <Games
            games={games}
            loading={loadingGames}
            onRefreshGames={refreshGames}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </div>
      )}

      {mountedTabs.has("assistant") && (
        <div className={activeTab !== "assistant" ? "hidden" : ""}>
          <Assistant
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </div>
      )}

      {mountedTabs.has("settings") && (
        <div className={activeTab !== "settings" ? "hidden" : ""}>
          <Settings
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </div>
      )}
    </>
  )
}
