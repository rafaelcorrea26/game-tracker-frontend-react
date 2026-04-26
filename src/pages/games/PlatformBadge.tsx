import { KNOWN_PLATFORMS } from "./platforms"

type Props = {
  platform?: string
}

export function PlatformBadge({ platform }: Props) {
  if (!platform) return null

  const known = KNOWN_PLATFORMS.find((p) => p.value === platform)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
        known ? `${known.badgeBg} ${known.badgeText}` : "bg-slate-100 text-slate-700"
      }`}
    >
      {known && <span className="text-xs leading-none">{known.icon}</span>}
      {platform}
    </span>
  )
}
