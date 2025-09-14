import type { PostStatus } from '../../types'
import { formatPlatform, formatStatusLabel } from '../../utils/format'

export const STATUS_OPTIONS: Array<{ value: PostStatus | ''; label: string }> = [
  { value: '', label: 'All Status' },
  { value: 'FLAGGED', label: formatStatusLabel('FLAGGED') },
  { value: 'UNDER_REVIEW', label: formatStatusLabel('UNDER_REVIEW') },
  { value: 'DISMISSED', label: formatStatusLabel('DISMISSED') },
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
