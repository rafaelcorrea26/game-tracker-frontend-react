const BASE_URL = import.meta.env.VITE_API_URL

export async function api<T, B = unknown>(
  path: string,
  method: string = "GET",
  body?: B
): Promise<T> {
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = "Erro na requisição"

    try {
      const errorBody = (await res.json()) as { error?: string }
      if (errorBody?.error) {
        message = errorBody.error
      }
    } catch {}

    throw new Error(message)
  }

  return res.json()
}