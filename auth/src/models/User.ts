import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types/userTypes';

interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
}

const userSchema = new mongoose.Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CLIENT
  },
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
