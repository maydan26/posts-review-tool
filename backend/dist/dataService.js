"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DataService {
    constructor() {
        this.totalPosts = 0;
        this.postsCache = new Map();
        this.cacheSize = 100; // Cache up to 100 posts in memory
        this.dataFilePath = path.join(__dirname, '..', 'mock-post.json');
        this.initializeData();
    }
    initializeData() {
        try {
            // Only read the file to get total count, don't load all posts
            const data = fs.readFileSync(this.dataFilePath, 'utf8');
            const allPosts = JSON.parse(data);
            this.totalPosts = allPosts.length;
            console.log(`📊 Database initialized with ${this.totalPosts} posts`);
        }
        catch (error) {
            console.error('Error initializing data:', error);
            this.totalPosts = 0;
        }
    }
    async loadPostsFromFile(startIndex = 0, count = 20) {
        try {
            const data = fs.readFileSync(this.dataFilePath, 'utf8');
            const allPosts = JSON.parse(data);
            // Sort by created_at descending (newest first)
            allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return allPosts.slice(startIndex, startIndex + count);
        }
        catch (error) {
            console.error('Error loading posts from file:', error);
            return [];
        }
    }
    async loadPostById(id) {
        // Check cache first
        if (this.postsCache.has(id)) {
            return this.postsCache.get(id);
        }
        try {
            const data = fs.readFileSync(this.dataFilePath, 'utf8');
            const allPosts = JSON.parse(data);
            const post = allPosts.find(p => p.id === id);
            if (post) {
                // Cache the post
                this.cachePost(post);
                return post;
            }
            return null;
        }
        catch (error) {
            console.error('Error loading post by ID:', error);
            return null;
        }
    }
    cachePost(post) {
        // Simple LRU-like cache management
        if (this.postsCache.size >= this.cacheSize) {
            // Remove oldest entry (simple approach)
            const firstKey = this.postsCache.keys().next().value;
            if (firstKey !== undefined) {
                this.postsCache.delete(firstKey);
            }
        }
        this.postsCache.set(post.id, post);
    }
    async updatePostInFile(post) {
        try {
            const data = fs.readFileSync(this.dataFilePath, 'utf8');
            const allPosts = JSON.parse(data);
            const postIndex = allPosts.findIndex(p => p.id === post.id);
            if (postIndex === -1) {
                return false;
            }
            // Update only the specific post
            allPosts[postIndex] = post;
            // Write back to file
            fs.writeFileSync(this.dataFilePath, JSON.stringify(allPosts, null, 2));
            // Update cache
            this.cachePost(post);
            return true;
        }
        catch (error) {
            console.error('Error updating post in file:', error);
            return false;
        }
    }
    async getPosts(filters = {}) {
        const limit = filters.limit || 20;
        const offset = filters.offset || 0;
        // If no filters, use simple pagination
        if (!filters.status && !filters.platform && !filters.tag && !filters.search) {
            const posts = await this.loadPostsFromFile(offset, limit);
            return {
                data: posts,
                total: this.totalPosts,
                limit,
                offset,
                hasMore: offset + limit < this.totalPosts
            };
        }
        // For filtered queries, load all posts once and apply all filters in a single pass
        try {
            const data = fs.readFileSync(this.dataFilePath, 'utf8');
            const allPosts = JSON.parse(data);
            // Apply all filters in a single pass for better performance
            const filteredPosts = allPosts.filter(post => {
                // Status filter
                if (filters.status && post.status !== filters.status) {
                    return false;
                }
                // Platform filter
                if (filters.platform && !post.platform.toLowerCase().includes(filters.platform.toLowerCase())) {
                    return false;
                }
                // Tag filter
                if (filters.tag && !post.tags.some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase()))) {
                    return false;
                }
                // Search filter
                if (filters.search && !post.text.toLowerCase().includes(filters.search.toLowerCase())) {
                    return false;
                }
                return true;
            });
            // Sort by created_at descending (newest first)
            filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            // Apply pagination
            const total = filteredPosts.length;
            const paginatedPosts = filteredPosts.slice(offset, offset + limit);
            const hasMore = offset + limit < total;
            return {
                data: paginatedPosts,
                total,
                limit,
                offset,
                hasMore
            };
        }
        catch (error) {
            console.error('Error getting filtered posts:', error);
            return {
                data: [],
                total: 0,
                limit,
                offset,
                hasMore: false
            };
        }
    }
    async updatePostStatus(id, status) {
        const post = await this.loadPostById(id);
        if (!post) {
            return null;
        }
        post.status = status;
        const success = await this.updatePostInFile(post);
        return success ? post : null;
    }
    async addTagToPost(id, tag) {
        const post = await this.loadPostById(id);
        if (!post) {
            return null;
        }
        if (!post.tags.includes(tag)) {
            post.tags.push(tag);
            const success = await this.updatePostInFile(post);
            return success ? post : null;
        }
        return post;
    }
    async removeTagFromPost(id, tag) {
        const post = await this.loadPostById(id);
        if (!post) {
            return null;
        }
        post.tags = post.tags.filter(t => t !== tag);
        const success = await this.updatePostInFile(post);
        return success ? post : null;
    }
    async getPostById(id) {
        return await this.loadPostById(id);
    }
    // Utility method to get database stats
    getStats() {
        return {
            totalPosts: this.totalPosts,
            cacheSize: this.postsCache.size
        };
    }
}
exports.dataService = new DataService();
//# sourceMappingURL=dataService.js.map