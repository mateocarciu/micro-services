import { Schema, model, Document, Types } from 'mongoose';

interface IOrderItem {
  itemId: Types.ObjectId; 
  itemName: string;       
}

interface IOrder extends Document {
  userId: string; // External user identifier
  status: string;
  items: IOrderItem[];
}

const OrderItemSchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true }, // No ref to another collection
  itemName: { type: String, required: true },
});

const OrderSchema: Schema = new Schema({
  customerId: { type: String, required: true },
  livreurId: { type: String, required: false },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'pending-delivery', 'delivering', 'closed'], 
    required: true, 
    default: 'pending' 
  },
  items: { type: [OrderItemSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Order = model<IOrder>('Order', OrderSchema);
export default Order;
