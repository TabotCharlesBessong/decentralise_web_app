import { Request, Response } from 'express';
import Vote from '../models/Vote';
import Project from '../models/Project';
import { UserRole } from '../models/User';
import crypto from 'crypto';
import blockchainService from '../services/blockchain.service';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

export const castVote = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if project exists and is active
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'active') {
      return res.status(400).json({ message: 'Project is not active for voting' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      where: { userId, projectId },
    });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted for this project' });
    }

    // Create vote hash
    const voteHash = crypto
      .createHash('sha256')
      .update(`${userId}-${projectId}-${Date.now()}`)
      .digest('hex');

    // Record vote on blockchain
    const blockchainTransactionId = await blockchainService.castVote(
      project.blockchainVoteId,
      voteHash,
      req.user?.id.toString() || ''
    );

    // Create vote record
    const vote = await Vote.create({
      userId,
      projectId: parseInt(projectId),
      voteHash,
      blockchainTransactionId,
      timestamp: new Date(),
    });

    // Update project vote count
    await project.increment('totalVotes');

    res.status(201).json({
      message: 'Vote cast successfully',
      vote,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error casting vote', error });
  }
};

export const getVotes = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const votes = await Vote.findAll({
      where: { projectId },
      include: ['voter'],
    });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching votes', error });
  }
};

export const getUserVotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const votes = await Vote.findAll({
      where: { userId },
      include: ['project'],
    });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user votes', error });
  }
};

// Helper function to record vote on blockchain
async function recordVoteOnBlockchain(
  blockchainVoteId: string,
  voteHash: string
): Promise<string> {
  // This is a placeholder for the actual blockchain integration
  // In a real implementation, you would:
  // 1. Call the smart contract to record the vote
  // 2. Return the transaction hash
  return `tx_${Date.now()}_${voteHash.substring(0, 8)}`;
} 