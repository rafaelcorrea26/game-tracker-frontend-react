import { useState } from "react"
import { api } from "@/services/api"
import AppShell, { type AppTab } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type SettingsProps = {
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
}

type ChangePasswordResponse = {
  message: string
}

type ChangePasswordBody = {
  current_password: string
  new_password: string
}

export default function Settings({
  onNavigate,
  onLogout,
}: SettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChangePassword = async () => {
    setError("")
    setSuccess("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Preencha todos os campos.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As novas senhas não coincidem.")
      return
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }

    try {
      setLoading(true)

      const response = await api<ChangePasswordResponse, ChangePasswordBody>(
        "/change-password",
        "PUT",
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      )

      setSuccess(response.message)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      setError("Não foi possível alterar a senha.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell
      title="Configurações"
      activeTab="settings"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
          </CardHeader>

          <CardContent className="max-w-xl space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Senha atual
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Nova senha
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Confirmar nova senha
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}