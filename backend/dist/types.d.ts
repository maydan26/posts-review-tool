export interface Post {
    id: number;
    platform: string;
    text: string;
    status: PostStatus;
    tags: string[];
    created_at: string;
}
export type PostStatus = 'FLAGGED' | 'UNDER_REVIEW' | 'DISMISSED';
export interface PostFilters {
    status?: PostStatus;
    platform?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}
export interface UpdateStatusRequest {
    status: PostStatus;
}
export interface AddTagRequest {
    tag: string;
}
//# sourceMappingURL=types.d.ts.map