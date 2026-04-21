import { useEffect, useState } from "react"
import { subscribeToToasts } from "@/components/ui/use-toast"

type ToastItem = {
  id: number
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToToasts(setToasts)
    return unsubscribe
  }, [])

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[280px] rounded-lg px-4 py-3 shadow-lg text-white ${
            toast.variant === "destructive" ? "bg-red-500" : "bg-slate-900"
          }`}
        >
          <p className="font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm opacity-90">{toast.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}