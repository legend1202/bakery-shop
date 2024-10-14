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
  startTime: string;
  endTime: string;
  payment: string;
  color: string;
  mon_ini: string;
  mon_end: string;
  tue_ini: string;
  tue_end: string;
  wed_ini: string;
  wed_end: string;
  thu_ini: string;
  thu_end: string;
  fri_ini: string;
  fri_end: string;
  sat_ini: string;
  sat_end: string;
  sun_ini: string;
  sun_end: string;
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
    startTime: { type: String, default: '9' },
    endTime: { type: String, default: '17' },
    payment: { type: String },
    color: { type: String },
    bio: { type: String },
    loginStatus: { type: Boolean },
    mon_ini: { type: String, default: '9' },
    mon_end: { type: String, default: '17' },
    tue_ini: { type: String, default: '9' },
    tue_end: { type: String, default: '17' },
    wed_ini: { type: String, default: '9' },
    wed_end: { type: String, default: '17' },
    thu_ini: { type: String, default: '9' },
    thu_end: { type: String, default: '17' },
    fri_ini: { type: String, default: '9' },
    fri_end: { type: String, default: '17' },
    sat_ini: { type: String, default: '9' },
    sat_end: { type: String, default: '17' },
    sun_ini: { type: String, default: '9' },
    sun_end: { type: String, default: '17' },
  },
  {
    timestamps: true,
  }
);

export const UsersModel = model<Users>('Users', UsersSchema);
