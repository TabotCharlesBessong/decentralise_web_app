import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router; 