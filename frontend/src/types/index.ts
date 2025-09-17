export type PostStatus = 'FLAGGED' | 'UNDER_REVIEW' | 'DISMISSED';

export interface Post {
  id: number;
  platform: string;
  text: string;
  status: PostStatus;
  tags: string[];
  created_at: string; // ISO string
}

export interface PostFilters {
  status?: PostStatus;
  platform?: string;
  tag?: string; // single tag for now (aligns with backend)
  search?: string;
  limit?: number;   // page size
  offset?: number;  // (page - 1) * limit
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// Tag Options Context Types
export interface TagOptionsContextType {
  tagOptions: string[];
  addTagOption: (tag: string) => void;
  isLoading: boolean;
}
