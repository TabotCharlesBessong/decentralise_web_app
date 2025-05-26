import { Request, Response } from 'express';
import Project, { ProjectStatus } from '../models/Project';
import { Web3 } from 'web3';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';
import blockchainService from '../services/blockchain.service';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

const web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'http://localhost:8545');

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const managerId = req.user?.id;

    if (!managerId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Create project on blockchain
    const blockchainVoteId = await blockchainService.createProject(title);

    const project = await Project.create({
      title,
      description,
      managerId,
      startDate,
      endDate,
      blockchainVoteId,
      status: ProjectStatus.PENDING,
      totalVotes: 0
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll({
      include: ['manager'],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: ['manager'],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, status } = req.body;
    const managerId = (req as any).user.id;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the project manager
    if (project.managerId !== managerId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    await project.update({
      title,
      description,
      startDate,
      endDate,
      status,
    });

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
};

// Helper function to create blockchain vote
async function createBlockchainVote(title: string): Promise<string> {
  // This is a placeholder for the actual blockchain integration
  // In a real implementation, you would:
  // 1. Deploy a smart contract for the vote
  // 2. Return the contract address or transaction hash
  return `vote_${Date.now()}_${title.replace(/\s+/g, '_').toLowerCase()}`;
} 