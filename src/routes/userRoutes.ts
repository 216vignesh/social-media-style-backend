import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  follow,
  unfollow,
  getFollowers,
  getFollowing
} from '../controllers/userController';

const router = Router();
router.use(requireAuth);
router.post('/:id/follow', follow);
router.delete('/:id/follow', unfollow);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
export default router;
