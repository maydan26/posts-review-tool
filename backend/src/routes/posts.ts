import { Router } from 'express';
import { PostsController } from '../controllers/postsController';

const router = Router();

// GET /posts - List posts with filters and pagination
router.get('/', PostsController.getPosts);

// PATCH /posts/:id/status - Update post status
router.patch('/:id/status', PostsController.updatePostStatus);

// POST /posts/:id/tags - Add tag to post
router.post('/:id/tags', PostsController.addTagToPost);

// DELETE /posts/:id/tags/:tag - Remove tag from post
router.delete('/:id/tags/:tag', PostsController.removeTagFromPost);

export default router;
