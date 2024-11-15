import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


export interface CashcutDocument extends Document {
  id: string;
  branchId: string;
  total: number;
  saleDate: string;
  createdAt: Date;
  updateAt: Date;
}


const CashcutSchema = new Schema<CashcutDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    branchId: {
      type: String,
      ref: 'Branches',
    },
    total: { type: Number },
    saleDate: { type: String },
  },
  {
    timestamps: true,
  }
);

export const CashcutModel = model<CashcutDocument>('Cashcut', CashcutSchema);
