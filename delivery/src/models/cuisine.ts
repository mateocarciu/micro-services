import { Schema, model, Document, Types } from 'mongoose';

interface ICuisineOrder extends Document {
  order: Types.ObjectId;
  status: string;
  preparedBy?: Types.ObjectId; // Reference to the chef or person preparing the order
  receivedAt: Date;
  updatedAt: Date;
}

const CuisineOrderSchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in preparation', 'ready to serve'], 
    required: true, 
    default: 'pending' 
  },
  preparedBy: { type: Schema.Types.ObjectId, ref: 'User' },  // Optional field to track the chef
  receivedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
CuisineOrderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const CuisineOrder = model<ICuisineOrder>('CuisineOrder', CuisineOrderSchema);

export default CuisineOrder;
