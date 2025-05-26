import { Web3 } from 'web3';
import { AbiItem } from 'web3-utils';
import dotenv from 'dotenv';

dotenv.config();

// Contract ABI (you would get this after compiling the smart contract)
const contractABI: AbiItem[] = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "projectId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            }
        ],
        "name": "ProjectCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "projectId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "voteHash",
                "type": "bytes32"
            }
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            }
        ],
        "name": "createProject",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_projectId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "_voteHash",
                "type": "bytes32"
            }
        ],
        "name": "castVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

class BlockchainService {
    private web3: Web3;
    private contract: any;
    private ownerAddress: string;

    constructor() {
        this.web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'http://localhost:8545');
        this.contract = new this.web3.eth.Contract(
            contractABI,
            process.env.CONTRACT_ADDRESS
        );
        this.ownerAddress = process.env.OWNER_ADDRESS || '';
    }

    async createProject(title: string): Promise<string> {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const result = await this.contract.methods
                .createProject(title)
                .send({ from: this.ownerAddress });

            // Get the ProjectCreated event
            const event = result.events.ProjectCreated;
            return event.returnValues.projectId;
        } catch (error) {
            console.error('Error creating project on blockchain:', error);
            throw error;
        }
    }

    async castVote(projectId: string, voteHash: string, voterAddress: string): Promise<string> {
        try {
            const result = await this.contract.methods
                .castVote(projectId, voteHash)
                .send({ from: voterAddress });

            // Get the VoteCast event
            const event = result.events.VoteCast;
            return event.transactionHash;
        } catch (error) {
            console.error('Error casting vote on blockchain:', error);
            throw error;
        }
    }

    async getProjectVotes(projectId: string): Promise<number> {
        try {
            return await this.contract.methods.getProjectVotes(projectId).call();
        } catch (error) {
            console.error('Error getting project votes from blockchain:', error);
            throw error;
        }
    }

    async hasVoted(projectId: string, voterAddress: string): Promise<boolean> {
        try {
            return await this.contract.methods.hasVoted(projectId, voterAddress).call();
        } catch (error) {
            console.error('Error checking if user has voted:', error);
            throw error;
        }
    }
}

export default new BlockchainService(); 