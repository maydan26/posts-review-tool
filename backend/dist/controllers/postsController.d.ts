import { Request, Response } from 'express';
export declare class PostsController {
    /**
     * GET /posts - List posts with filters and pagination
     */
    static getPosts(req: Request, res: Response): Promise<void>;
    /**
     * PATCH /posts/:id/status - Update post status
     */
    static updatePostStatus(req: Request, res: Response): Promise<void>;
    /**
     * POST /posts/:id/tags - Add tag to post
     */
    static addTagToPost(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /posts/:id/tags/:tag - Remove tag from post
     */
    static removeTagFromPost(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=postsController.d.ts.map