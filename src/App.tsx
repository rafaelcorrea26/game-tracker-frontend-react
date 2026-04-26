import { useEffect, useState } from "react"
import { api } from "@/services/api"
import type { Game } from "@/types/Game"

import Login from "./pages/Login"
import Games from "./pages/games/Games"
import Dashboard from "./pages/Dashboard"
import Assistant from "./pages/Assistant"
import Settings from "./pages/Settings"
import type { AppTab } from "@/components/layout/AppShell"

export default function App() {
  const [token] = useState<string | null>(() => localStorage.getItem("token"))
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard")
  const [games, setGames] = useState<Game[]>([])
  const [loadingGames, setLoadingGames] = useState(false)

  useEffect(() => {
    if (!token) return

    const loadGames = async () => {
      try {
        setLoadingGames(true)
        const data = await api<Game[]>("/games")
        setGames(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setGames([])
      } finally {
        setLoadingGames(false)
      }
    }

    void loadGames()
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  const refreshGames = async () => {
    try {
      setLoadingGames(true)
      const data = await api<Game[]>("/games")
      setGames(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setGames([])
    } finally {
      setLoadingGames(false)
    }
  }

  if (!token) {
    return <Login />
  }

  if (activeTab === "dashboard") {
    return (
      <Dashboard
        games={games}
        onNavigate={setActiveTab}
        onLogout={handleLogout}
      />
    )
  }

  if (activeTab === "assistant") {
    return (
      <Assistant
        onNavigate={setActiveTab}
        onLogout={handleLogout}
      />
    )
  }

  if (activeTab === "settings") {
    return (
      <Settings
        onNavigate={setActiveTab}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <Games
      games={games}
      loading={loadingGames}
      onRefreshGames={refreshGames}
      onNavigate={setActiveTab}
      onLogout={handleLogout}
    />
  )
}