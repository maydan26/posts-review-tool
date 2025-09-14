import axios from 'axios';
import type { Post, PostFilters, PaginatedResponse, PostStatus } from '../types';

const BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

// GET /posts with server-side filters + pagination
export function getPosts(
  filters: PostFilters = {},
  options?: { signal?: AbortSignal }
): Promise<PaginatedResponse<Post>> {
  return axios
    .get<PaginatedResponse<Post>>(`${BASE_URL}/posts`, {
      params: filters,
      signal: options?.signal,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
    .then((r) => r.data);
}

// PATCH /posts/:id/status
export function updateStatus(
  id: number,
  status: PostStatus,
  options?: { signal?: AbortSignal }
): Promise<Post> {
  return axios
    .patch<Post>(`${BASE_URL}/posts/${id}/status`, { status }, {
      signal: options?.signal,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
    .then((r) => r.data);
}

// POST /posts/:id/tags
export function addTag(
  id: number,
  tag: string,
  options?: { signal?: AbortSignal }
): Promise<Post> {
  return axios
    .post<Post>(`${BASE_URL}/posts/${id}/tags`, { tag }, {
      signal: options?.signal,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
    .then((r) => r.data);
}

// DELETE /posts/:id/tags/:tag
export function removeTag(
  id: number,
  tag: string,
  options?: { signal?: AbortSignal }
): Promise<Post> {
  return axios
    .delete<Post>(`${BASE_URL}/posts/${id}/tags/${encodeURIComponent(tag)}`, {
      signal: options?.signal,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
    .then((r) => r.data);
}
