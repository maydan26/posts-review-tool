"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postsController_1 = require("../controllers/postsController");
const router = (0, express_1.Router)();
// GET /posts - List posts with filters and pagination
router.get('/', postsController_1.PostsController.getPosts);
// PATCH /posts/:id/status - Update post status
router.patch('/:id/status', postsController_1.PostsController.updatePostStatus);
// POST /posts/:id/tags - Add tag to post
router.post('/:id/tags', postsController_1.PostsController.addTagToPost);
// DELETE /posts/:id/tags/:tag - Remove tag from post
router.delete('/:id/tags/:tag', postsController_1.PostsController.removeTagFromPost);
exports.default = router;
//# sourceMappingURL=posts.js.map