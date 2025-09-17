export function formatFromSnakeCase(input: string): string {
    return input
      .toLowerCase()
      .split("_")
      .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
}

export function formatPlatform(platform: string): string {
  if (!platform) return ''
  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

export function formatTag(tag: string): string {
  if (!tag) return ''
  return tag
    .split('-')
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(' ')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getUTCFullYear()
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const day = d.getUTCDate().toString().padStart(2, '0')
  const hh = d.getUTCHours().toString().padStart(2, '0')
  const mm = d.getUTCMinutes().toString().padStart(2, '0')
  return `${month} ${day}, ${y} ${hh}:${mm}`
}

// Return a semantic color key for MUI or Tailwind mapping
export function getStatusColor(status: string): 'success' | 'error' | 'warning' {
  switch (status) {
    case 'FLAGGED':
      return 'success' // green per requirement
    case 'DISMISSED':
      return 'error' // red
    case 'UNDER_REVIEW':
    default:
      return 'warning' // amber
  }
}
