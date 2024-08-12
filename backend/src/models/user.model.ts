import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Users extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordStr: string;
  password: string;
  branchId?: string;
  userId?: string;
  role: 'ADMIN' | 'SALESPERSON' | 'SUPERADMIN';
  bio?: string;
  createdAt: Date;
  updateAt: Date;
}

const UsersSchema = new Schema<Users>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    passwordStr: { type: String },
    password: { type: String },
    branchId: { type: String },
    userId: { type: String },
    role: {
      type: String,
    },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UsersModel = model<Users>('Users', UsersSchema);
