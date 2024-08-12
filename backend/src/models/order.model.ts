import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Orders extends Document {
  id: string;
  name: string;
  description: string;
  type: number; // 0 - Order(supply), 1 - Order(product)  
  productId: string;
  salesperson: string;
  quantity: number;
  status: string; // cancel, pending, success
  createdAt: Date;
  updateAt: Date;
}

const OrdersSchema = new Schema<Orders>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: Number,
    },
    productId: {
      type: String,
      ref: 'Products',
    },
    salesperson: {
      type: String,
      ref: 'Products',
    },
    quantity: { type: Number },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

// OrdersSchema.virtual('serviceObjects', {
//   ref: 'Services',
//   localField: 'servicesList',
//   foreignField: 'id',
//   justOne: false,
//   options: { sort: { name: 1 }, limit: 100 },
// });

export const OrdersModel = model<Orders>('Orders', OrdersSchema);
