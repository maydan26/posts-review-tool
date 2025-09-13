import { Request, Response } from 'express';
import { dataService } from '../dataService';
import { PostFilters, UpdateStatusRequest, AddTagRequest } from '../types';

export class PostsController {
  /**
   * GET /posts - List posts with filters and pagination
   */
  static async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const filters: PostFilters = {
        status: req.query.status as any,
        platform: req.query.platform as string,
        tag: req.query.tag as string,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await dataService.getPosts(filters);
      res.json(result);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PATCH /posts/:id/status - Update post status
   */
  static async updatePostStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body as UpdateStatusRequest;

      // Validation
      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      if (!['FLAGGED', 'UNDER_REVIEW', 'DISMISSED'].includes(status)) {
        res.status(400).json({ 
          error: 'Invalid status. Must be FLAGGED, UNDER_REVIEW, or DISMISSED' 
        });
        return;
      }

      const updatedPost = await dataService.updatePostStatus(id, status);
      if (!updatedPost) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * POST /posts/:id/tags - Add tag to post
   */
  static async addTagToPost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { tag } = req.body as AddTagRequest;

      // Validation
      if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        res.status(400).json({ 
          error: 'Tag is required and must be a non-empty string' 
        });
        return;
      }

      const updatedPost = await dataService.addTagToPost(id, tag.trim());
      if (!updatedPost) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.json(updatedPost);
    } catch (error) {
      console.error('Error adding tag to post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * DELETE /posts/:id/tags/:tag - Remove tag from post
   */
  static async removeTagFromPost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const tag = decodeURIComponent(req.params.tag);

      const updatedPost = await dataService.removeTagFromPost(id, tag);
      if (!updatedPost) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.json(updatedPost);
    } catch (error) {
      console.error('Error removing tag from post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
