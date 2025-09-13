import { Post, PostFilters, PaginatedResponse } from './types';
declare class DataService {
    private dataFilePath;
    private totalPosts;
    private postsCache;
    private cacheSize;
    constructor();
    private initializeData;
    private loadPostsFromFile;
    private loadPostById;
    private cachePost;
    private updatePostInFile;
    getPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>>;
    updatePostStatus(id: number, status: string): Promise<Post | null>;
    addTagToPost(id: number, tag: string): Promise<Post | null>;
    removeTagFromPost(id: number, tag: string): Promise<Post | null>;
    getPostById(id: number): Promise<Post | null>;
    getStats(): {
        totalPosts: number;
        cacheSize: number;
    };
}
export declare const dataService: DataService;
export {};
//# sourceMappingURL=dataService.d.ts.map