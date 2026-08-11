import { Router } from 'express';
import { login, me, logout, updatePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { wrap } from '../utils/asyncWrap';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', wrap(login));

// POST /api/v1/auth/logout (synchronous — no wrap needed)
router.post('/logout', logout);

// GET /api/v1/auth/me  — protected
router.get('/me', authenticate, wrap(me));

// PATCH /api/v1/auth/change-password  — protected
router.patch('/change-password', authenticate, wrap(updatePassword));

export default router;
