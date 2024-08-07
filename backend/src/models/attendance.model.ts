import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Attendances extends Document {
  id: string;
  salesperson: string;
  description: string;
  attendanceTime: string;
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
    salesperson: {
      type: String,
      ref: 'Products',
    },
    description: {
      type: String,
    },
    attendanceTime: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AttendancesModel = model<Attendances>('Attendances', AttendancesSchema);
