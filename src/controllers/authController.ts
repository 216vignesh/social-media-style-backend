import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { signToken } from '../utils/jwt';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    const id = await authService.register(username, email, password);
    const token = signToken({ userId: id });
    res.status(201).json({ data: { id, token } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const id = await authService.login(email, password);
    const token = signToken({ userId: id });
    res.json({ data: { id, token } });
  } catch (err) {
    next(err);
  }
}
