export type PlatformConfig = {
  value: string
  label: string
  icon: string
  badgeBg: string
  badgeText: string
}

export const KNOWN_PLATFORMS: PlatformConfig[] = [
  // Geração atual
  { value: "PC",              label: "PC / Steam",      icon: "🖥️", badgeBg: "bg-slate-800",   badgeText: "text-white" },
  { value: "PS5",             label: "PS5",              icon: "🎮", badgeBg: "bg-blue-600",    badgeText: "text-white" },
  { value: "Xbox Series",     label: "Xbox Series",      icon: "🕹️", badgeBg: "bg-green-600",   badgeText: "text-white" },
  { value: "Nintendo Switch", label: "Switch",           icon: "🕹️", badgeBg: "bg-red-500",     badgeText: "text-white" },
  // Geração anterior
  { value: "PS4",             label: "PS4",              icon: "🎮", badgeBg: "bg-blue-700",    badgeText: "text-white" },
  { value: "PS3",             label: "PS3",              icon: "🎮", badgeBg: "bg-blue-900",    badgeText: "text-white" },
  { value: "Xbox One",        label: "Xbox One",         icon: "🕹️", badgeBg: "bg-green-700",   badgeText: "text-white" },
  { value: "Xbox 360",        label: "Xbox 360",         icon: "🕹️", badgeBg: "bg-green-800",   badgeText: "text-white" },
  { value: "Wii / Wii U",     label: "Wii / Wii U",      icon: "🕹️", badgeBg: "bg-sky-500",     badgeText: "text-white" },
  // Portáteis
  { value: "Nintendo 3DS",    label: "Nintendo 3DS",     icon: "🎮", badgeBg: "bg-red-600",     badgeText: "text-white" },
  { value: "Nintendo DS",     label: "Nintendo DS",      icon: "🎮", badgeBg: "bg-red-700",     badgeText: "text-white" },
  { value: "Game Boy",        label: "Game Boy / GBA",   icon: "🎮", badgeBg: "bg-violet-600",  badgeText: "text-white" },
  { value: "PSP",             label: "PSP",              icon: "🎮", badgeBg: "bg-indigo-700",  badgeText: "text-white" },
  { value: "PS Vita",         label: "PS Vita",          icon: "🎮", badgeBg: "bg-indigo-900",  badgeText: "text-white" },
  // Clássicos
  { value: "PS2",             label: "PS2",              icon: "🎮", badgeBg: "bg-blue-950",    badgeText: "text-white" },
  { value: "PS1",             label: "PS1",              icon: "🎮", badgeBg: "bg-slate-600",   badgeText: "text-white" },
  { value: "Xbox",            label: "Xbox",             icon: "🕹️", badgeBg: "bg-green-900",   badgeText: "text-white" },
  { value: "GameCube",        label: "GameCube",         icon: "🕹️", badgeBg: "bg-purple-700",  badgeText: "text-white" },
  { value: "Nintendo 64",     label: "Nintendo 64",      icon: "🕹️", badgeBg: "bg-red-800",     badgeText: "text-white" },
  { value: "Super Nintendo",  label: "Super Nintendo",   icon: "🕹️", badgeBg: "bg-gray-700",    badgeText: "text-white" },
  { value: "Mega Drive",      label: "Mega Drive",       icon: "🕹️", badgeBg: "bg-zinc-700",    badgeText: "text-white" },
  { value: "Dreamcast",       label: "Dreamcast",        icon: "🕹️", badgeBg: "bg-orange-700",  badgeText: "text-white" },
  { value: "Mobile",          label: "Mobile",           icon: "📱", badgeBg: "bg-slate-500",   badgeText: "text-white" },
]
