export type GameStatus = "playing" | "completed" | "backlog"
export type FilterStatus = "all" | GameStatus
export type SortKey = "default" | "name" | "rating" | "year"

export type GameBody = {
  name: string
  status: string
  year_completed: number
  rating: number
  notes: string
  platform: string
}
