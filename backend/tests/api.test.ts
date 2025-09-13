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

// Add 404 handler for testing
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

describe('Flagged Posts API', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'Flagged Posts API is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
      expect(response.body.database).toHaveProperty('totalPosts');
    });
  });

  describe('GET /api/posts', () => {
    it('should return posts with default pagination', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('offset');
      expect(response.body).toHaveProperty('hasMore');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
    });

    it('should return posts with custom pagination', async () => {
      const response = await request(app)
        .get('/api/posts?limit=5&offset=0')
        .expect(200);

      expect(response.body.limit).toBe(5);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should handle pagination with offset', async () => {
      // Get first page
      const firstPage = await request(app)
        .get('/api/posts?limit=3&offset=0')
        .expect(200);

      // Get second page
      const secondPage = await request(app)
        .get('/api/posts?limit=3&offset=3')
        .expect(200);

      expect(firstPage.body.data.length).toBeLessThanOrEqual(3);
      expect(secondPage.body.data.length).toBeLessThanOrEqual(3);
      
      // Ensure no overlap between pages
      const firstPageIds = firstPage.body.data.map((post: any) => post.id);
      const secondPageIds = secondPage.body.data.map((post: any) => post.id);
      const overlap = firstPageIds.filter((id: number) => secondPageIds.includes(id));
      expect(overlap.length).toBe(0);
    });

    it('should return empty array when offset exceeds total', async () => {
      const response = await request(app)
        .get('/api/posts?limit=10&offset=1000')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.hasMore).toBe(false);
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/posts?status=FLAGGED')
        .expect(200);

      expect(response.body.data.every((post: any) => post.status === 'FLAGGED')).toBe(true);
    });

    it('should filter by platform', async () => {
      const response = await request(app)
        .get('/api/posts?platform=twitter')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.platform.toLowerCase().includes('twitter')
      )).toBe(true);
    });

    it('should filter by tag', async () => {
      const response = await request(app)
        .get('/api/posts?tag=health')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.tags.some((tag: string) => tag.toLowerCase().includes('health'))
      )).toBe(true);
    });

    it('should search in text content', async () => {
      const response = await request(app)
        .get('/api/posts?search=scam')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.text.toLowerCase().includes('scam')
      )).toBe(true);
    });

    it('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/posts?status=FLAGGED&platform=twitter&limit=5')
        .expect(200);

      expect(response.body.data.every((post: any) => 
        post.status === 'FLAGGED' && 
        post.platform.toLowerCase().includes('twitter')
      )).toBe(true);
    });

    it('should sort posts by created_at descending', async () => {
      const response = await request(app)
        .get('/api/posts?limit=5')
        .expect(200);

      const posts = response.body.data;
      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].created_at);
        const nextDate = new Date(posts[i + 1].created_at);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it('should handle invalid limit gracefully', async () => {
      const response = await request(app)
        .get('/api/posts?limit=0')
        .expect(200);

      expect(response.body.limit).toBe(20); // Should default to 20
    });

    it('should handle negative offset gracefully', async () => {
      const response = await request(app)
        .get('/api/posts?offset=-5')
        .expect(200);

      expect(response.body.offset).toBe(-5); // Current implementation allows negative offset
    });
  });

  describe('PATCH /api/posts/:id/status', () => {
    it('should update post status successfully', async () => {
      // First, get a post to update
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const newStatus = 'UNDER_REVIEW';

      const response = await request(app)
        .patch(`/api/posts/${postId}/status`)
        .send({ status: newStatus })
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.status).toBe(newStatus);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .patch('/api/posts/99999/status')
        .send({ status: 'UNDER_REVIEW' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Post not found');
    });

    it('should return 400 for missing status', async () => {
      const response = await request(app)
        .patch('/api/posts/1/status')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Status is required');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch('/api/posts/1/status')
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid status');
    });

    it('should accept all valid statuses', async () => {
      const validStatuses = ['FLAGGED', 'UNDER_REVIEW', 'DISMISSED'];
      
      for (const status of validStatuses) {
        const postsResponse = await request(app)
          .get('/api/posts?limit=1')
          .expect(200);

        const postId = postsResponse.body.data[0].id;

        const response = await request(app)
          .patch(`/api/posts/${postId}/status`)
          .send({ status })
          .expect(200);

        expect(response.body.status).toBe(status);
      }
    });
  });

  describe('POST /api/posts/:id/tags', () => {
    it('should add tag to post successfully', async () => {
      // Get a post to add tag to
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const originalTags = postsResponse.body.data[0].tags;
      const newTag = `test-tag-${Date.now()}`; // Use timestamp to ensure uniqueness

      const response = await request(app)
        .post(`/api/posts/${postId}/tags`)
        .send({ tag: newTag })
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.tags).toContain(newTag);
      expect(response.body.tags.length).toBe(originalTags.length + 1);
    });

    it('should not add duplicate tags', async () => {
      // Get a post with existing tags
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const existingTag = postsResponse.body.data[0].tags[0];

      const response = await request(app)
        .post(`/api/posts/${postId}/tags`)
        .send({ tag: existingTag })
        .expect(200);

      expect(response.body.id).toBe(postId);
      // Should not increase tag count
      expect(response.body.tags.length).toBe(postsResponse.body.data[0].tags.length);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .post('/api/posts/99999/tags')
        .send({ tag: 'test-tag' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Post not found');
    });

    it('should return 400 for missing tag', async () => {
      const response = await request(app)
        .post('/api/posts/1/tags')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Tag is required');
    });

    it('should return 400 for empty tag', async () => {
      const response = await request(app)
        .post('/api/posts/1/tags')
        .send({ tag: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Tag is required');
    });

    it('should return 400 for non-string tag', async () => {
      const response = await request(app)
        .post('/api/posts/1/tags')
        .send({ tag: 123 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Tag is required');
    });

    it('should trim whitespace from tags', async () => {
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const tagWithSpaces = '  spaced-tag  ';

      const response = await request(app)
        .post(`/api/posts/${postId}/tags`)
        .send({ tag: tagWithSpaces })
        .expect(200);

      expect(response.body.tags).toContain('spaced-tag');
      expect(response.body.tags).not.toContain('  spaced-tag  ');
    });
  });

  describe('DELETE /api/posts/:id/tags/:tag', () => {
    it('should remove tag from post successfully', async () => {
      // First add a tag, then remove it
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const tagToRemove = 'removable-tag';

      // Add tag first
      await request(app)
        .post(`/api/posts/${postId}/tags`)
        .send({ tag: tagToRemove })
        .expect(200);

      // Remove tag
      const response = await request(app)
        .delete(`/api/posts/${postId}/tags/${encodeURIComponent(tagToRemove)}`)
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.tags).not.toContain(tagToRemove);
    });

    it('should handle URL-encoded tags', async () => {
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const tagWithSpecialChars = 'tag with spaces & symbols!';

      // Add tag first
      await request(app)
        .post(`/api/posts/${postId}/tags`)
        .send({ tag: tagWithSpecialChars })
        .expect(200);

      // Remove tag
      const response = await request(app)
        .delete(`/api/posts/${postId}/tags/${encodeURIComponent(tagWithSpecialChars)}`)
        .expect(200);

      expect(response.body.tags).not.toContain(tagWithSpecialChars);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .delete('/api/posts/99999/tags/some-tag')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Post not found');
    });

    it('should handle removing non-existent tag gracefully', async () => {
      const postsResponse = await request(app)
        .get('/api/posts?limit=1')
        .expect(200);

      const postId = postsResponse.body.data[0].id;
      const nonExistentTag = 'non-existent-tag';

      const response = await request(app)
        .delete(`/api/posts/${postId}/tags/${encodeURIComponent(nonExistentTag)}`)
        .expect(200);

      expect(response.body.id).toBe(postId);
      // Should still return the post even if tag didn't exist
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .patch('/api/posts/1/status')
        .set('Content-Type', 'application/json')
        .send('{"status": "UNDER_REVIEW"') // Missing closing brace
        .expect(400);
    });
  });

  describe('Pagination Edge Cases', () => {
    it('should handle very large limit', async () => {
      const response = await request(app)
        .get('/api/posts?limit=10000')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(response.body.total);
      expect(response.body.hasMore).toBe(false);
    });

    it('should handle negative limit', async () => {
      const response = await request(app)
        .get('/api/posts?limit=-5')
        .expect(200);

      expect(response.body.limit).toBe(-5); // Current implementation allows negative limit
    });

    it('should handle non-numeric limit', async () => {
      const response = await request(app)
        .get('/api/posts?limit=abc')
        .expect(200);

      expect(response.body.limit).toBe(20); // Should default to 20
    });

    it('should handle non-numeric offset', async () => {
      const response = await request(app)
        .get('/api/posts?offset=xyz')
        .expect(200);

      expect(response.body.offset).toBe(0); // Should default to 0
    });

    it('should maintain pagination consistency across requests', async () => {
      // Get first page
      const page1 = await request(app)
        .get('/api/posts?limit=3&offset=0')
        .expect(200);

      // Get second page
      const page2 = await request(app)
        .get('/api/posts?limit=3&offset=3')
        .expect(200);

      // Get first page again
      const page1Again = await request(app)
        .get('/api/posts?limit=3&offset=0')
        .expect(200);

      // Results should be consistent
      expect(page1.body.data).toEqual(page1Again.body.data);
    });
  });
});
