import type { Post, PostFilters, PaginatedResponse, PostStatus } from '../types';

const BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

function buildQueryString(params: Record<string, unknown> = {}): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === '') return;
    if (Array.isArray(v)) v.forEach((iv) => iv !== '' && qs.append(k, String(iv)));
    else qs.append(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

async function getJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  if (!res.ok) {
    const message = isJson
      ? ((await res.json()) as any)?.message || `Request failed: ${res.status}`
      : `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return (isJson ? await res.json() : undefined) as T;
}

// GET /posts?status=&platform=&tag=&search=&limit=&offset=
export function getPosts(filters: PostFilters = {}, options?: { signal?: AbortSignal }) {
  const qs = buildQueryString(filters);
  return getJson<PaginatedResponse<Post>>(`${BASE_URL}/posts${qs}`, {
    method: 'GET',
    signal: options?.signal,
  });
}

// PATCH /posts/:id/status
export function updateStatus(id: number, status: PostStatus, options?: { signal?: AbortSignal }) {
  return getJson<Post>(`${BASE_URL}/posts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    signal: options?.signal,
  });
}

// POST /posts/:id/tags
export function addTag(id: number, tag: string, options?: { signal?: AbortSignal }) {
  return getJson<Post>(`${BASE_URL}/posts/${id}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tag }),
    signal: options?.signal,
  });
}

// DELETE /posts/:id/tags/:tag
export function removeTag(id: number, tag: string, options?: { signal?: AbortSignal }) {
  return getJson<Post>(`${BASE_URL}/posts/${id}/tags/${encodeURIComponent(tag)}`, {
    method: 'DELETE',
    signal: options?.signal,
  });
}
