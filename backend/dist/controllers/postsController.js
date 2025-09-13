"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const dataService_1 = require("../dataService");
class PostsController {
    /**
     * GET /posts - List posts with filters and pagination
     */
    static async getPosts(req, res) {
        try {
            const filters = {
                status: req.query.status,
                platform: req.query.platform,
                tag: req.query.tag,
                search: req.query.search,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset) : undefined,
            };
            const result = await dataService_1.dataService.getPosts(filters);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    /**
     * PATCH /posts/:id/status - Update post status
     */
    static async updatePostStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
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
            const updatedPost = await dataService_1.dataService.updatePostStatus(id, status);
            if (!updatedPost) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }
            res.json(updatedPost);
        }
        catch (error) {
            console.error('Error updating post status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    /**
     * POST /posts/:id/tags - Add tag to post
     */
    static async addTagToPost(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { tag } = req.body;
            // Validation
            if (!tag || typeof tag !== 'string' || tag.trim() === '') {
                res.status(400).json({
                    error: 'Tag is required and must be a non-empty string'
                });
                return;
            }
            const updatedPost = await dataService_1.dataService.addTagToPost(id, tag.trim());
            if (!updatedPost) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }
            res.json(updatedPost);
        }
        catch (error) {
            console.error('Error adding tag to post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    /**
     * DELETE /posts/:id/tags/:tag - Remove tag from post
     */
    static async removeTagFromPost(req, res) {
        try {
            const id = parseInt(req.params.id);
            const tag = decodeURIComponent(req.params.tag);
            const updatedPost = await dataService_1.dataService.removeTagFromPost(id, tag);
            if (!updatedPost) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }
            res.json(updatedPost);
        }
        catch (error) {
            console.error('Error removing tag from post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.PostsController = PostsController;
//# sourceMappingURL=postsController.js.map