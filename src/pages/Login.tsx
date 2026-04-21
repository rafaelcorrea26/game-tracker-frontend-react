import { useState } from "react"
import { api } from "@/services/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LoginResponse = {
  token: string
}

type LoginBody = {
  username: string
  password: string
}

type RegisterResponse = {
  message: string
}

type RegisterBody = {
  username: string
  password: string
}

type Mode = "login" | "register"

export default function Login() {
  const [mode, setMode] = useState<Mode>("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const resetMessages = () => {
    setError("")
    setSuccess("")
  }

  const handleLogin = async () => {
    resetMessages()

    if (!username.trim() || !password.trim()) {
      setError("Preencha usuário e senha.")
      return
    }

    try {
      setLoading(true)

      const response = await api<LoginResponse, LoginBody>(
        "/login",
        "POST",
        {
          username,
          password,
        }
      )

      localStorage.setItem("token", response.token)
      window.location.reload()
    } catch (err) {
      console.error(err)
      setError("Usuário ou senha inválidos.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    resetMessages()

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Preencha todos os campos.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    try {
      setLoading(true)

      await api<RegisterResponse, RegisterBody>(
        "/register",
        "POST",
        {
          username,
          password,
        }
      )

      setSuccess("Conta criada com sucesso. Agora faça login.")
      setMode("login")
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      setError("Não foi possível criar a conta. Tente outro usuário.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (mode === "login") {
      await handleLogin()
      return
    }

    await handleRegister()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-slate-500">Bem-vindo</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Game Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Gerencie o progresso dos seus jogos em um só lugar.
          </p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="space-y-4">
            <CardTitle>
              {mode === "login" ? "Entrar na conta" : "Criar conta"}
            </CardTitle>

            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              <Button
                type="button"
                variant={mode === "login" ? "default" : "ghost"}
                onClick={() => {
                  resetMessages()
                  setMode("login")
                }}
              >
                Login
              </Button>

              <Button
                type="button"
                variant={mode === "register" ? "default" : "ghost"}
                onClick={() => {
                  resetMessages()
                  setMode("register")
                }}
              >
                Criar conta
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Usuário
              </label>
              <Input
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === "register" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Confirmar senha
                </label>
                <Input
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            ) : null}

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
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading
                ? mode === "login"
                  ? "Entrando..."
                  : "Criando conta..."
                : mode === "login"
                  ? "Entrar"
                  : "Criar conta"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}