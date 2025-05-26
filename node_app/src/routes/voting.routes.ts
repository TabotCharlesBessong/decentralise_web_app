import { Router } from 'express';
import { castVote, getVotes, getUserVotes } from '../controllers/voting.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Cast a vote
router.post('/projects/:projectId/vote', castVote);

// Get votes for a project (only project managers and admins)
router.get('/projects/:projectId/votes', authorize(UserRole.PROJECT_MANAGER, UserRole.ADMIN), getVotes);

// Get user's votes
router.get('/my-votes', getUserVotes);

export default router; 