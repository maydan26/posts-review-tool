import request from 'supertest';
import express from 'express';
import cors from 'cors';
import postsRouter from '../src/routes/posts';
import { HealthController } from '../src/controllers/healthController';

// Create test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/posts', postsRouter);
app.get('/api/health', HealthController.getHealth);

describe('DataService Integration Tests', () => {
  describe('Pagination with Real Data', () => {
    it('should handle pagination correctly with real data', async () => {
      // Test first page
      const page1 = await request(app)
        .get('/api/posts?limit=5&offset=0')
        .expect(200);

      expect(page1.body.data.length).toBeLessThanOrEqual(5);
      expect(page1.body.total).toBeGreaterThan(0);
      expect(page1.body.limit).toBe(5);
      expect(page1.body.offset).toBe(0);

      // Test second page
      const page2 = await request(app)
        .get('/api/posts?limit=5&offset=5')
        .expect(200);

      expect(page2.body.data.length).toBeLessThanOrEqual(5);
      expect(page2.body.limit).toBe(5);
      expect(page2.body.offset).toBe(5);

      // Ensure no overlap
      const page1Ids = page1.body.data.map((post: any) => post.id);
      const page2Ids = page2.body.data.map((post: any) => post.id);
      const overlap = page1Ids.filter((id: number) => page2Ids.includes(id));
      expect(overlap.length).toBe(0);
    });

    it('should handle filtering with pagination', async () => {
      const response = await request(app)
        .get('/api/posts?status=FLAGGED&limit=3&offset=0')
        .expect(200);

      expect(response.body.data.every((post: any) => post.status === 'FLAGGED')).toBe(true);
      expect(response.body.limit).toBe(3);
      expect(response.body.offset).toBe(0);
    });

    it('should maintain sort order across pages', async () => {
      const page1 = await request(app)
        .get('/api/posts?limit=3&offset=0')
        .expect(200);

      const page2 = await request(app)
        .get('/api/posts?limit=3&offset=3')
        .expect(200);

      // Check that posts are sorted by created_at descending within each page
      const checkSortOrder = (posts: any[]) => {
        for (let i = 0; i < posts.length - 1; i++) {
          const currentDate = new Date(posts[i].created_at);
          const nextDate = new Date(posts[i + 1].created_at);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      };

      if (page1.body.data.length > 1) {
        checkSortOrder(page1.body.data);
      }
      if (page2.body.data.length > 1) {
        checkSortOrder(page2.body.data);
      }
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency after updates', async () => {
      // Get a post
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const originalStatus = postsResponse.body.data[0].status;

      // Update status
      const newStatus = originalStatus === 'FLAGGED' ? 'UNDER_REVIEW' : 'FLAGGED';
      await request(app)
        .patch(`/api/posts/${postId}/status`)
        .send({ status: newStatus })
        .expect(200);

      // Verify the change
      const updatedResponse = await request(app)
        .get(`/api/posts?limit=100`)
        .expect(200);

      const updatedPost = updatedResponse.body.data.find((post: any) => post.id === postId);
      expect(updatedPost).toBeDefined();
      expect(updatedPost.status).toBe(newStatus);

      // Revert the change
      await request(app)
        .patch(`/api/posts/${postId}/status`)
        .send({ status: originalStatus })
        .expect(200);
    });

    it('should maintain tag consistency after operations', async () => {
      // Get a post
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const originalTags = [...postsResponse.body.data[0].tags];
      const testTag = 'integration-test-tag';

      // Add tag
      await request(app)
        .post(`/api/posts/${postId}/tags`)
        .send({ tag: testTag })
        .expect(200);

      // Verify tag was added
      const afterAddResponse = await request(app)
        .get(`/api/posts?limit=100`)
        .expect(200);

      const postAfterAdd = afterAddResponse.body.data.find((post: any) => post.id === postId);
      expect(postAfterAdd.tags).toContain(testTag);

      // Remove tag
      await request(app)
        .delete(`/api/posts/${postId}/tags/${encodeURIComponent(testTag)}`)
        .expect(200);

      // Verify tag was removed
      const afterRemoveResponse = await request(app)
        .get(`/api/posts?limit=100`)
        .expect(200);

      const postAfterRemove = afterRemoveResponse.body.data.find((post: any) => post.id === postId);
      expect(postAfterRemove.tags).not.toContain(testTag);
      expect(postAfterRemove.tags).toEqual(originalTags);
    });
  });

  describe('Edge Cases with Real Data', () => {
    it('should handle large offset gracefully', async () => {
      const response = await request(app)
        .get('/api/posts?limit=10&offset=1000')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.hasMore).toBe(false);
    });

    it('should handle zero limit by defaulting to 20', async () => {
      const response = await request(app)
        .get('/api/posts?limit=0')
        .expect(200);

      expect(response.body.limit).toBe(20);
    });

    it('should handle very large limit', async () => {
      const response = await request(app)
        .get('/api/posts?limit=10000')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(response.body.total);
      expect(response.body.hasMore).toBe(false);
    });

    it('should handle non-numeric parameters', async () => {
      const response = await request(app)
        .get('/api/posts?limit=abc&offset=xyz')
        .expect(200);

      expect(response.body.limit).toBe(20); // Should default
      expect(response.body.offset).toBe(0); // Should default
    });
  });

  describe('Filter Combinations', () => {
    it('should handle multiple filters together', async () => {
      const response = await request(app)
        .get('/api/posts?status=FLAGGED&platform=twitter&limit=5')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.status === 'FLAGGED' && 
        post.platform.toLowerCase().includes('twitter')
      )).toBe(true);
    });

    it('should handle search with other filters', async () => {
      const response = await request(app)
        .get('/api/posts?search=scam&status=FLAGGED&limit=5')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.text.toLowerCase().includes('scam') && 
        post.status === 'FLAGGED'
      )).toBe(true);
    });

    it('should handle tag filter with pagination', async () => {
      const response = await request(app)
        .get('/api/posts?tag=health&limit=3&offset=0')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.tags.some((tag: string) => tag.toLowerCase().includes('health'))
      )).toBe(true);
      expect(response.body.limit).toBe(3);
      expect(response.body.offset).toBe(0);
    });
  });
});
