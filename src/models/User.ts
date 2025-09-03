import mongoose, { Document, Schema } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  walletAddress: string;
  chainId?: number;
  balance?: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema: Schema = new Schema({
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid Ethereum wallet address']
  },
  chainId: {
    type: Number,
    required: false,
    default: 1 // Ethereum mainnet by default
  },
  balance: {
    type: String,
    required: false,
    default: '0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Export the model
export default mongoose.model<IUser>('User', userSchema);
