import { useEffect, useState } from "react"
import { api } from "@/services/api"
import type { Game } from "@/types/Game"

import Login from "./pages/Login"
import Games from "./pages/Games"
import Dashboard from "./pages/Dashboard"
import Assistant from "./pages/Assistant"
import Settings from "./pages/Settings"
import type { AppTab } from "@/components/layout/AppShell"

export default function App() {
  const token = localStorage.getItem("token")
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard")
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (!token) return

    const loadGames = async () => {
      try {
        const data = await api<Game[]>("/games")
        setGames(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setGames([])
      }
    }

    loadGames()
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
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
      onNavigate={setActiveTab}
      onLogout={handleLogout}
    />
  )
}