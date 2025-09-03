import mongoose, { Document, Schema } from 'mongoose';

// Interface for Crop document
export interface ICrop extends Document {
  name: string;
  symbol: string;
  crop: string;
  image: string;
  landArea: string;
  yieldSeason: string;
  status: 'Active' | 'Coming Soon' | 'Completed' | 'Paused';
  tvl: string;
  apy: string;
  yieldLogic: string;
  bgColor: string;
  statusColor: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Crop Schema
const cropSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Crop token name is required'],
    unique: true,
    trim: true
  },
  symbol: {
    type: String,
    required: [true, 'Token symbol is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  crop: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Crop image is required'],
    trim: true
  },
  landArea: {
    type: String,
    required: [true, 'Land area is required'],
    trim: true
  },
  yieldSeason: {
    type: String,
    required: [true, 'Yield season is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Active', 'Coming Soon', 'Completed', 'Paused'],
      message: 'Status must be Active, Coming Soon, Completed, or Paused'
    },
    default: 'Coming Soon'
  },
  tvl: {
    type: String,
    required: [true, 'TVL (Total Value Locked) is required'],
    trim: true
  },
  apy: {
    type: String,
    required: [true, 'APY is required'],
    trim: true
  },
  yieldLogic: {
    type: String,
    required: [true, 'Yield logic explanation is required'],
    trim: true,
    minlength: [10, 'Yield logic must be at least 10 characters'],
    maxlength: [500, 'Yield logic cannot exceed 500 characters']
  },
  bgColor: {
    type: String,
    required: [true, 'Background color is required'],
    trim: true
  },
  statusColor: {
    type: String,
    required: [true, 'Status color is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Create compound index for better performance
cropSchema.index({ status: 1, isActive: 1 });
cropSchema.index({ symbol: 1, name: 1 });

// Pre-save middleware to sync isActive with status
cropSchema.pre('save', function(next) {
  this.isActive = this.status === 'Active';
  next();
});

// Export the model
export default mongoose.model<ICrop>('Crop', cropSchema);
