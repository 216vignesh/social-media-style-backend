"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.requireAuth, postController_1.createPost);
router.get('/me', authMiddleware_1.requireAuth, postController_1.getMyPosts);
router.get('/user/:id', postController_1.getUserPosts);
router.get('/feed', authMiddleware_1.requireAuth, postController_1.getFeed);
exports.default = router;
