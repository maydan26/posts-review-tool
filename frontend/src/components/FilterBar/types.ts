import type { PostStatus } from '../../types'

export interface Filters {
  status: PostStatus | ''
  platform: string
  tag: string[]
  search: string
}
