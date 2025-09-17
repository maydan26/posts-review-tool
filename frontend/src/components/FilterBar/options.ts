import type { PostStatus } from '../../types'
import { formatPlatform, formatFromSnakeCase } from '../../utils/format'
import { STATUS_VALUES } from '../../constants/status'

export const STATUS_OPTIONS: Array<{ value: PostStatus | ''; label: string }> = [
  { value: '', label: 'All Status' },
  ...STATUS_VALUES.map((s) => ({ value: s, label: formatFromSnakeCase(s)})),
]

export const PLATFORM_OPTIONS: string[] = [
  '', 'twitter', 'facebook', 'instagram', 'tiktok', 'reddit', 'telegram',
]

export const TAG_OPTIONS: string[] = [
  'health', 'politics', 'finance', 'spam', 'scam',
  'misinformation', 'science', 'sports', 'lifestyle', 'research',
]

export const getPlatformLabel = (value: string) =>
  value ? formatPlatform(value) : 'All Platforms'
