import { useEffect, useRef, useState } from "react"
import AppShell, { type AppTab } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AssistantProps = {
  onNavigate: (tab: AppTab) => void
  onLogout: () => void
}

export default function Assistant({
  onNavigate,
  onLogout,
}: AssistantProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = message

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setMessage("")
    setLoading(true)

    try {
      let response = "Não entendi, tente algo como: 'quais jogos estou jogando?'"

      if (userMessage.toLowerCase().includes("jogando")) {
        response = "Você pode ver seus jogos em andamento na aba de jogos 🎮"
      } else if (userMessage.toLowerCase().includes("zerados")) {
        response = "Confira os jogos zerados no dashboard 📊"
      } else if (userMessage.toLowerCase().includes("backlog")) {
        response = "Seu backlog está disponível na aba jogos 📚"
      } else if (userMessage.toLowerCase().includes("adicionar")) {
        response = "Para adicionar um jogo, clique em 'Novo jogo' 🎯"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao processar a mensagem." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) void sendMessage()
  }

  return (
    <AppShell
      title="Assistente IA"
      activeTab="assistant"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Assistente (modo offline)</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl border bg-slate-50 p-4">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Exemplos:
                  <br />
                  • quais jogos estou jogando?
                  <br />
                  • como adicionar um jogo?
                  <br />
                  • ver backlog
                </p>
              ) : (
                messages.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`max-w-[90%] rounded-xl px-4 py-3 text-sm sm:max-w-[80%] ${
                      item.role === "user"
                        ? "ml-auto bg-slate-900 text-white"
                        : "border bg-white text-slate-800"
                    }`}
                  >
                    {item.content}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />

              <Button
                onClick={() => void sendMessage()}
                disabled={loading}
                className="shrink-0"
              >
                {loading ? "..." : "Enviar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
