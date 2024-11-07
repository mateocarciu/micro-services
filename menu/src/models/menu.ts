import { Schema, model, Document } from 'mongoose';

interface IMenuItem extends Document {
  menuItemName: string;
  availabilityStatus: boolean;
}

const MenuItemSchema: Schema = new Schema({
  menuItemName: { type: String, required: true },
  availabilityStatus: { type: Boolean, default: true, required: true }, // Default to true
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

MenuItemSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const MenuItem = model<IMenuItem>('MenuItem', MenuItemSchema);
export default MenuItem;
