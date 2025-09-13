import { Post, PostFilters, PaginatedResponse } from './types';
import * as fs from 'fs';
import * as path from 'path';

class DataService {
  private dataFilePath: string;
  private totalPosts: number = 0;

  constructor() {
    this.dataFilePath = path.join(__dirname, '..', 'mock-post.json');
    this.initializeData();
  }

  private initializeData(): void {
    try {
      // Only read the file to get total count, don't load all posts
      const data = fs.readFileSync(this.dataFilePath, 'utf8');
      const allPosts: Post[] = JSON.parse(data);
      this.totalPosts = allPosts.length;
      console.log(`📊 Database initialized with ${this.totalPosts} posts`);
    } catch (error) {
      console.error('Error initializing data:', error);
      this.totalPosts = 0;
    }
  }

  private async loadPostsFromFile(startIndex: number = 0, count: number = 20): Promise<Post[]> {
    try {
      const data = fs.readFileSync(this.dataFilePath, 'utf8');
      const allPosts: Post[] = JSON.parse(data);
      
      // Sort by created_at descending (newest first)
      allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return allPosts.slice(startIndex, startIndex + count);
    } catch (error) {
      console.error('Error loading posts from file:', error);
      return [];
    }
  }

  private async loadPostById(id: number): Promise<Post | null> {
    try {
      const data = fs.readFileSync(this.dataFilePath, 'utf8');
      const allPosts: Post[] = JSON.parse(data);
      const post = allPosts.find(p => p.id === id);
      return post || null;
    } catch (error) {
      console.error('Error loading post by ID:', error);
      return null;
    }
  }


  private async updatePostInFile(post: Post): Promise<boolean> {
    try {
      const data = fs.readFileSync(this.dataFilePath, 'utf8');
      const allPosts: Post[] = JSON.parse(data);
      
      const postIndex = allPosts.findIndex(p => p.id === post.id);
      if (postIndex === -1) {
        return false;
      }

      // Update only the specific post
      allPosts[postIndex] = post;
      
      // Write back to file
      fs.writeFileSync(this.dataFilePath, JSON.stringify(allPosts, null, 2));
      
      return true;
    } catch (error) {
      console.error('Error updating post in file:', error);
      return false;
    }
  }

  async getPosts(filters: PostFilters = {}): Promise<PaginatedResponse<Post>> {
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
      const allPosts: Post[] = JSON.parse(data);

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
        if (filters.tag && !post.tags.some(tag => tag.toLowerCase().includes(filters.tag!.toLowerCase()))) {
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
    } catch (error) {
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

  async updatePostStatus(id: number, status: string): Promise<Post | null> {
    const post = await this.loadPostById(id);
    if (!post) {
      return null;
    }

    post.status = status as any;
    const success = await this.updatePostInFile(post);
    
    return success ? post : null;
  }

  async addTagToPost(id: number, tag: string): Promise<Post | null> {
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

  async removeTagFromPost(id: number, tag: string): Promise<Post | null> {
    const post = await this.loadPostById(id);
    if (!post) {
      return null;
    }

    post.tags = post.tags.filter(t => t !== tag);
    const success = await this.updatePostInFile(post);
    
    return success ? post : null;
  }


  // Utility method to get database stats
  getStats(): { totalPosts: number } {
    return {
      totalPosts: this.totalPosts
    };
  }
}

export const dataService = new DataService();
