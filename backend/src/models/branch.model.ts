import { v4 as uuidv4 } from 'uuid';
import { Document, model, Schema } from 'mongoose';

export interface Branches extends Document {
  id: string;
  name: string;
  location: string;
  bio?: string;
  userId: string; // Admin - Branch Owner
  createdAt: Date;
  updateAt: Date;
}

const BranchesSchema = new Schema<Branches>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    name: { type: String },
    location: { type: String },
    bio: { type: String },
    userId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const BranchesModel = model<Branches>('Branches', BranchesSchema);
