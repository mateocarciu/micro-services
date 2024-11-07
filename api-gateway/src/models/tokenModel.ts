import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const tokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h' // Nettoyage automatique des tokens expirés
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

export const Token = mongoose.model<IToken>('Token', tokenSchema);