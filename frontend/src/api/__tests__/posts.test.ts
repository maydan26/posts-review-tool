import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { getPosts, updateStatus, addTag, removeTag } from '../posts'
import type { Post, PostStatus, PaginatedResponse, PostFilters } from '../../types'

const mock = new MockAdapter(axios)

describe('api/posts (axios)', () => {
  beforeEach(() => {
    mock.reset()
  })

  it('getPosts calls /posts with params and returns data', async () => {
    const sample: PaginatedResponse<Post> = {
      data: [
        {
          id: 1 as any,
          text: 'Hello',
          platform: 'twitter',
          status: 'FLAGGED',
          tags: ['t1'],
          created_at: '2025-01-01T00:00:00Z',
        } as any,
      ],
      total: 20,
      limit: 5,
      offset: 0,
    }
    mock.onGet(/\/posts/).reply((config) => {
      expect(config.params).toMatchObject({ limit: 5, offset: 0 })
      return [200, sample]
    })

    const res = await getPosts({ limit: 5, offset: 0 } as PostFilters)
    expect(res.total).toBe(20)
    expect(res.data.length).toBe(1)
  })

  it('updateStatus calls PATCH and returns Post', async () => {
    const updated: Post = {
      id: 1 as any,
      text: 'Hello',
      platform: 'twitter',
      status: 'DISMISSED',
      tags: ['t1'],
      created_at: '2025-01-01T00:00:00Z',
    } as any

    mock.onPatch(/\/posts\/1\/status/).reply((config) => {
      expect(JSON.parse(config.data)).toEqual({ status: 'DISMISSED' })
      return [200, updated]
    })

    const res = await updateStatus(1, 'DISMISSED' as PostStatus)
    expect(res.status).toBe('DISMISSED')
  })

  it('addTag calls POST and returns Post', async () => {
    const updated: Post = {
      id: 1 as any,
      text: 'Hello',
      platform: 'twitter',
      status: 'FLAGGED',
      tags: ['t1', 'new'],
      created_at: '2025-01-01T00:00:00Z',
    } as any

    mock.onPost(/\/posts\/1\/tags/).reply((config) => {
      expect(JSON.parse(config.data)).toEqual({ tag: 'new' })
      return [200, updated]
    })

    const res = await addTag(1, 'new')
    expect(res.tags.includes('new')).toBe(true)
  })

  it('removeTag calls DELETE and returns Post', async () => {
    const updated: Post = {
      id: 1 as any,
      text: 'Hello',
      platform: 'twitter',
      status: 'FLAGGED',
      tags: ['t1'],
      created_at: '2025-01-01T00:00:00Z',
    } as any

    mock.onDelete(/\/posts\/1\/tags\/.+/).reply(200, updated)

    const res = await removeTag(1, 'new')
    expect(res.tags.includes('new')).toBe(false)
  })
})
