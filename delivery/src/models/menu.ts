import { Schema, model, Document } from 'mongoose';

interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string; // e.g., appetizer, main course, dessert, etc.
  availability: boolean;
  imageUrl?: string; // Optional field for an image of the dish
}

const MenuItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  availability: { type: Boolean, default: true },
  imageUrl: { type: String }
});

const MenuItem = model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
