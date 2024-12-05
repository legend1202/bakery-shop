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
  loginStatus: false;
  startTime: number;
  endTime: number;
  payment: string;
  color: string;
  mon_ini: number;
  mon_end: number;
  tue_ini: number;
  tue_end: number;
  wed_ini: number;
  wed_end: number;
  thu_ini: number;
  thu_end: number;
  fri_ini: number;
  fri_end: number;
  sat_ini: number;
  sat_end: number;
  sun_ini: number;
  sun_end: number;
  work_hour: number;
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
    startTime: { type: Number, default: 0 },
    endTime: { type: Number, default: 0 },
    payment: { type: String },
    color: { type: String },
    bio: { type: String },
    loginStatus: { type: Boolean },
    mon_ini: { type: Number, default: 0 },
    mon_end: { type: Number, default: 0 },
    tue_ini: { type: Number, default: 0 },
    tue_end: { type: Number, default: 0 },
    wed_ini: { type: Number, default: 0 },
    wed_end: { type: Number, default: 0 },
    thu_ini: { type: Number, default: 0 },
    thu_end: { type: Number, default: 0 },
    fri_ini: { type: Number, default: 0 },
    fri_end: { type: Number, default: 0 },
    sat_ini: { type: Number, default: 0 },
    sat_end: { type: Number, default: 0 },
    sun_ini: { type: Number, default: 0 },
    sun_end: { type: Number, default: 0 },
    work_hour: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const UsersModel = model<Users>('Users', UsersSchema);
