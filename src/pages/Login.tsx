import { useState } from "react"
import { api } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LoginResponse = {
  token: string
}

type AuthBody = {
  username: string
  password: string
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    if (!username.trim() || !password.trim()) {
      setError("Preencha usuário e senha.")
      return
    }

    try {
      setLoading(true)

      if (isLogin) {
        const response = await api<LoginResponse, AuthBody>("/login", "POST", {
          username,
          password,
        })

        localStorage.setItem("token", response.token)
        window.location.reload()
        return
      }

      await api<{ message: string }, AuthBody>("/register", "POST", {
        username,
        password,
      })

      setSuccess("Usuário criado com sucesso. Agora faça login.")
      setIsLogin(true)
      setPassword("")
    } catch (err) {
      console.error(err)
      setError(isLogin ? "Falha no login." : "Falha no cadastro.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <p className="text-sm font-medium text-slate-500">Game Tracker</p>
          <CardTitle className="text-2xl sm:text-3xl">
            {isLogin ? "Entrar" : "Criar conta"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Usuário
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu usuário"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
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

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
          </Button>

          <button
            type="button"
            className="w-full text-sm text-slate-600 underline-offset-4 hover:underline"
            onClick={() => {
              setIsLogin((prev) => !prev)
              setError("")
              setSuccess("")
            }}
          >
            {isLogin
              ? "Não tem conta? Criar agora"
              : "Já tem conta? Entrar"}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}