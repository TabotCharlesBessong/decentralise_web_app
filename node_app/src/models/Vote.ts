import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Project from './Project';

export interface VoteAttributes {
  id?: number;
  userId: number;
  projectId: number;
  voteHash: string;
  blockchainTransactionId: string;
  timestamp: Date;
}

class Vote extends Model<VoteAttributes> implements VoteAttributes {
  public id!: number;
  public userId!: number;
  public projectId!: number;
  public voteHash!: string;
  public blockchainTransactionId!: string;
  public timestamp!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'id',
      },
    },
    voteHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    blockchainTransactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'votes',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'projectId'],
      },
    ],
  }
);

// Define associations
Vote.belongsTo(User, { foreignKey: 'userId', as: 'voter' });
Vote.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export default Vote; 