import { v4 as uuidv4 } from 'uuid';
import { Document, model, Schema } from 'mongoose';

export interface Attendances extends Document {
  id: string;
  userId: string;
  branchId: string;
  bio?: string;
  status: boolean;
  attendanceTime?: string;
  createdAt: Date;
  updateAt: Date;
}

const AttendancesSchema = new Schema<Attendances>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      ref: 'Users',
    },
    branchId: {
      type: String, // Fixed typo here
    },
    status: { type: Boolean },
    bio: {
      type: String,
    },
    attendanceTime: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AttendancesModel = model<Attendances>(
  'Attendances',
  AttendancesSchema
);
