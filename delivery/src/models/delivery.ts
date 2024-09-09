import { Schema, model, Document, Types } from 'mongoose';

interface IDelivery extends Document {
  order: Types.ObjectId;
  deliveryPerson: Types.ObjectId;
  status: string;
  assignmentDate: Date;
  deliveryDate?: Date;
}

const DeliverySchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  deliveryPerson: { type: Schema.Types.ObjectId, ref: 'DeliveryPerson', required: true },
  status: { type: String, enum: ['pending', 'in progress', 'delivered'], required: true, default: 'pending' },
  assignmentDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date }
});

const Delivery = model<IDelivery>('Delivery', DeliverySchema);

export default Delivery;
