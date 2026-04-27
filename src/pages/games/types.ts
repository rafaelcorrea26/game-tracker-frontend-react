export type GameStatus = "playing" | "completed" | "backlog"
export type FilterStatus = "all" | GameStatus
export type SortKey = "default" | "name" | "rating" | "date"

export type GameBody = {
  name: string
  status: string
  start_date: string
  end_date: string
  rating: number
  notes: string
  platform: string
}
