import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Branches extends Document {
  id: string;
  name: string;
  location: string;
  bio: string;
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
  },
  {
    timestamps: true,
  }
);

export const BranchesModel = model<Branches>('Branches', BranchesSchema);
