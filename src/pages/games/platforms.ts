export type PlatformConfig = {
  value: string
  label: string
  icon: string
  badgeBg: string
  badgeText: string
}

export const KNOWN_PLATFORMS: PlatformConfig[] = [
  { value: "PC",              label: "PC / Steam",    icon: "🖥️",  badgeBg: "bg-slate-800",  badgeText: "text-white" },
  { value: "PS5",             label: "PS5",            icon: "🎮",  badgeBg: "bg-blue-600",   badgeText: "text-white" },
  { value: "PS4",             label: "PS4",            icon: "🎮",  badgeBg: "bg-blue-700",   badgeText: "text-white" },
  { value: "PS3",             label: "PS3",            icon: "🎮",  badgeBg: "bg-blue-900",   badgeText: "text-white" },
  { value: "Xbox Series",     label: "Xbox Series",    icon: "🕹️", badgeBg: "bg-green-600",  badgeText: "text-white" },
  { value: "Xbox One",        label: "Xbox One",       icon: "🕹️", badgeBg: "bg-green-700",  badgeText: "text-white" },
  { value: "Nintendo Switch", label: "Switch",         icon: "🕹️", badgeBg: "bg-red-500",    badgeText: "text-white" },
  { value: "Wii / Wii U",     label: "Wii / Wii U",    icon: "🕹️", badgeBg: "bg-sky-500",    badgeText: "text-white" },
  { value: "Game Boy",        label: "Game Boy / GBA", icon: "🎮",  badgeBg: "bg-violet-600", badgeText: "text-white" },
  { value: "Mobile",          label: "Mobile",         icon: "📱",  badgeBg: "bg-slate-500",  badgeText: "text-white" },
]
