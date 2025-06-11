import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as userService from '../services/userService';

export async function follow(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const follower = req.userId!;
    const followee = req.params.id;
    if (follower === followee) throw { status: 400, message: "Can't follow yourself" };
    await userService.followUser(follower, followee);
    res.json({ data: 'ok' });
  } catch (err) {
    next(err);
  }
}

export async function unfollow(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await userService.unfollowUser(req.userId!, req.params.id);
    res.json({ data: 'ok' });
  } catch (err) {
    next(err);
  }
}

export async function getFollowers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const list = await userService.getFollowers(req.params.id);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}

export async function getFollowing(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const list = await userService.getFollowing(req.params.id);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}
