type ToastItem = {
  id: number
  title: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastListener = (items: ToastItem[]) => void

let listeners: ToastListener[] = []
let items: ToastItem[] = []

function emit() {
  listeners.forEach((listener) => listener(items))
}

export function pushToast(toast: Omit<ToastItem, "id">) {
  const newToast: ToastItem = {
    ...toast,
    id: Date.now(),
  }

  items = [...items, newToast]
  emit()

  window.setTimeout(() => {
    items = items.filter((item) => item.id !== newToast.id)
    emit()
  }, 3000)
}

export function subscribeToToasts(listener: ToastListener) {
  listeners = [...listeners, listener]
  listener(items)

  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function useToast() {
  return {
    toast: pushToast,
  }
}