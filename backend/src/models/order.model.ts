import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the Orders interface
export interface OrderDocument extends Document {
  id: string;
  userId: string;
  salesDate: string;

  packageFirm: boolean;

  deliverMethod: boolean; // Pickup / Deliver

  pickupStatus: boolean;
  pickupDate: string;

  deliverId: string;
  deliverDate: string;

  branchId: string;

  customerName: string;
  cellPhone: string;
  homePhone: string;
  address: string;

  floor: string;
  base: string;
  people: string;
  place: string;
  wafer: string;
  figure: string;

  // color
  bottom: string;
  border: string;
  details: string;
  ribbon: string;
  sabor1: string;
  sabor2: string;

  artificial: string;
  natural: string;
  color: string;
  doll: string;
  candle: string;

  cake: string;
  cakebundle: string;
  basebundle: string;
  dollOrCandle: string;

  total: number;

  status: 0; //0: pending 1: confirmed,  2: cancelled.

  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const OrdersSchema = new Schema<OrderDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
    },
    salesDate: {
      type: String,
    },
    packageFirm: {
      type: Boolean,
    },
    deliverMethod: {
      type: Boolean,
    },
    pickupDate: {
      type: String,
    },
    deliverDate: {
      type: String,
    },

    branchId: {
      type: String,
    },
    customerName: {
      type: String,
    },
    cellPhone: {
      type: String,
    },
    homePhone: {
      type: String,
    },
    address: {
      type: String,
    },

    floor: {
      type: String,
    },
    base: {
      type: String,
    },
    people: {
      type: String,
    },
    place: {
      type: String,
    },
    wafer: {
      type: String,
    },
    figure: {
      type: String,
    },
    bottom: {
      type: String,
    },
    border: {
      type: String,
    },
    details: {
      type: String,
    },
    ribbon: {
      type: String,
    },
    sabor1: {
      type: String,
    },
    sabor2: {
      type: String,
    },
    artificial: {
      type: String,
    },
    natural: {
      type: String,
    },
    color: {
      type: String,
    },
    doll: {
      type: String,
    },
    candle: {
      type: String,
    },
    cake: {
      type: String,
    },
    cakebundle: {
      type: String,
    },
    basebundle: {
      type: String,
    },
    dollOrCandle: {
      type: String,
    },
    total: {
      type: Number,
    },
    status: {
      type: Number,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt
  }
);

// Create and export the Orders model
export const OrdersModel = model<OrderDocument>('Orders', OrdersSchema);
