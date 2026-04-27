const BASE = "https://api.rawg.io/api"
const KEY = import.meta.env.VITE_RAWG_API_KEY as string | undefined

type RawgGame = {
  id: number
  name: string
  released: string | null
  background_image: string | null
  platforms: { platform: { slug: string } }[] | null
}

const PLATFORM_MAP: Record<string, string> = {
  "pc":                    "PC",
  "playstation5":          "PS5",
  "playstation4":          "PS4",
  "playstation3":          "PS3",
  "playstation2":          "PS2",
  "playstation":           "PS1",
  "xbox-series-x":         "Xbox Series",
  "xbox-one":              "Xbox One",
  "xbox360":               "Xbox 360",
  "xbox":                  "Xbox",
  "nintendo-switch":       "Nintendo Switch",
  "nintendo-3ds":          "Nintendo 3DS",
  "nintendo-ds":           "Nintendo DS",
  "nintendo-64":           "Nintendo 64",
  "snes":                  "Super Nintendo",
  "wii-u":                 "Wii / Wii U",
  "wii":                   "Wii / Wii U",
  "gamecube":              "GameCube",
  "game-boy-advance":      "Game Boy",
  "game-boy-color":        "Game Boy",
  "game-boy":              "Game Boy",
  "psp":                   "PSP",
  "playstation-vita":      "PS Vita",
  "sega-genesis":          "Mega Drive",
  "sega-mega-drive-genesis": "Mega Drive",
  "dreamcast":             "Dreamcast",
  "ios":                   "Mobile",
  "android":               "Mobile",
}

export type RawgResult = {
  name: string
  platform: string
  year: string
  image: string | null
}

export function rawgConfigured(): boolean {
  return Boolean(KEY)
}

export async function searchGames(query: string): Promise<RawgResult[]> {
  if (!query.trim() || !KEY) return []
  const url = `${BASE}/games?search=${encodeURIComponent(query)}&key=${KEY}&page_size=8&search_precise=true`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Falha ao buscar jogos")
  const data = (await res.json()) as { results: RawgGame[] }
  return (data.results ?? []).map((g) => ({
    name: g.name,
    platform: (g.platforms ?? []).map((p) => PLATFORM_MAP[p.platform.slug]).find(Boolean) ?? "",
    year: g.released ? g.released.slice(0, 4) : "",
    image: g.background_image,
  }))
}
