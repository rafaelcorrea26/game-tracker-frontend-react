const BASE_URL = "http://localhost:8080"

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
    throw new Error("Erro na requisição")
  }

  return res.json()
}