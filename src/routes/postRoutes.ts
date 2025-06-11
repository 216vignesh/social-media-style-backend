import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  createPost,
  getMyPosts,
  getUserPosts,
  getFeed
} from '../controllers/postController';

const router = Router();
router.post('/', requireAuth, createPost);
router.get('/me', requireAuth, getMyPosts);
router.get('/user/:id', getUserPosts);
router.get('/feed', requireAuth, getFeed);
export default router;
