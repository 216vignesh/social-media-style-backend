import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as postService from '../services/postService';

export async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const author = req.userId!;
    const { content, mediaUrl } = req.body;
    if (!content) throw { status: 400, message: 'Content is required' };
    const postId = await postService.createPost(author, content, mediaUrl);
    res.status(201).json({ data: { postId } });
  } catch (err) {
    next(err);
  }
}

export async function getMyPosts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const posts = await postService.getPostsByUser(req.userId!);
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
}

export async function getUserPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await postService.getPostsByUser(req.params.id);
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
}

export async function getFeed(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;
    const feed = await postService.getFeed(req.userId!, limit, skip);
    res.json({ data: feed });
  } catch (err) {
    next(err);
  }
}
