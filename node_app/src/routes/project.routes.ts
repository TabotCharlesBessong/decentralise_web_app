import { Router } from 'express';
import { createProject, getProjects, getProjectById, updateProject } from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all projects
router.get('/', getProjects);

// Get project by ID
router.get('/:id', getProjectById);

// Create project (only project managers and admins)
router.post('/', authorize(UserRole.PROJECT_MANAGER, UserRole.ADMIN), createProject);

// Update project (only project managers and admins)
router.put('/:id', authorize(UserRole.PROJECT_MANAGER, UserRole.ADMIN), updateProject);

export default router; 