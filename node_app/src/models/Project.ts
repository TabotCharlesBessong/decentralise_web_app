import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

export enum ProjectStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ProjectAttributes {
  id?: number;
  title: string;
  description: string;
  managerId: number;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  blockchainVoteId: string;
  totalVotes: number;
}

class Project extends Model<ProjectAttributes> implements ProjectAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public managerId!: number;
  public status!: ProjectStatus;
  public startDate!: Date;
  public endDate!: Date;
  public blockchainVoteId!: string;
  public totalVotes!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProjectStatus)),
      allowNull: false,
      defaultValue: ProjectStatus.PENDING,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blockchainVoteId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'projects',
  }
);

// Define associations
Project.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

export default Project; 