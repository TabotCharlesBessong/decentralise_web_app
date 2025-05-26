# Decentralized Project Voting Application

A blockchain-based voting application for project selection in companies. This application allows project managers to create projects and employees to vote on them using blockchain technology for transparency and immutability.

## Features

- User authentication and authorization
- Role-based access control (Admin, Project Manager, Employee)
- Project creation and management
- Decentralized voting system
- Vote tracking and verification
- Blockchain integration for vote immutability

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Ethereum node (local or remote)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd decentralized-voting-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voting_app
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Blockchain Configuration
ETHEREUM_NETWORK=localhost
ETHEREUM_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=your_contract_address
```

4. Create the database:
```bash
createdb voting_app
```

5. Run database migrations:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Projects
- GET /api/projects - Get all projects
- GET /api/projects/:id - Get project by ID
- POST /api/projects - Create new project (Project Manager only)
- PUT /api/projects/:id - Update project (Project Manager only)

### Voting
- POST /api/voting/projects/:projectId/vote - Cast a vote
- GET /api/voting/projects/:projectId/votes - Get votes for a project
- GET /api/voting/my-votes - Get user's votes

## Development

1. Start the development server:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

## Security

- All passwords are hashed using bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS and Helmet for security headers

## Blockchain Integration

The application uses Web3.js to interact with the Ethereum blockchain. Each vote is recorded on the blockchain to ensure transparency and immutability.

## License

MIT 