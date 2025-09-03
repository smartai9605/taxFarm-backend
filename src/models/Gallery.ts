import mongoose, { Document, Schema } from 'mongoose';

// Interface for Gallery document
export interface IGallery extends Document {
  plotName: string;
  plotId: number;
  status: 'Acquired' | 'Cultivation' | 'Harvested' | 'Planned' | 'Maintenance';
  crop: string;
  region: 'Midwest' | 'Northwest' | 'Southwest' | 'Southeast' | 'Northeast';
  label: 'Before' | 'Drone' | 'Harvest' | 'Progress' | 'Equipment';
  caption: string;
  date: Date;
  image: string;
  imageAlt?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Gallery Schema
const gallerySchema: Schema = new Schema({
  plotName: {
    type: String,
    required: [true, 'Plot name is required'],
    trim: true,
    minlength: [2, 'Plot name must be at least 2 characters'],
    maxlength: [100, 'Plot name cannot exceed 100 characters']
  },
  plotId: {
    type: Number,
    required: [true, 'Plot ID is required'],
    min: [1, 'Plot ID must be a positive number']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Acquired', 'Cultivation', 'Harvested', 'Planned', 'Maintenance'],
      message: 'Status must be Acquired, Cultivation, Harvested, Planned, or Maintenance'
    }
  },
  crop: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true,
    minlength: [2, 'Crop name must be at least 2 characters'],
    maxlength: [50, 'Crop name cannot exceed 50 characters']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: {
      values: ['Midwest', 'Northwest', 'Southwest', 'Southeast', 'Northeast'],
      message: 'Region must be Midwest, Northwest, Southwest, Southeast, or Northeast'
    }
  },
  label: {
    type: String,
    required: [true, 'Label is required'],
    enum: {
      values: ['Before', 'Drone', 'Harvest', 'Progress', 'Equipment'],
      message: 'Label must be Before, Drone, Harvest, Progress, or Equipment'
    }
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    trim: true,
    minlength: [10, 'Caption must be at least 10 characters'],
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  imageAlt: {
    type: String,
    trim: true,
    maxlength: [200, 'Image alt text cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Create compound indexes for better performance
gallerySchema.index({ plotId: 1, date: -1 });
gallerySchema.index({ status: 1, isActive: 1 });
gallerySchema.index({ crop: 1, region: 1 });
gallerySchema.index({ label: 1, status: 1 });

// Pre-save middleware to set imageAlt if not provided
gallerySchema.pre('save', function(next) {
  if (!this.imageAlt) {
    this.imageAlt = `${this.label} photo of ${this.plotName} - ${this.crop} in ${this.region}`;
  }
  next();
});

// Instance method to get status color class
gallerySchema.methods.getStatusColor = function(): string {
  switch (this.status.toLowerCase()) {
    case 'acquired': return 'bg-orange text-orange-foreground';
    case 'cultivation': return 'bg-green-500 text-white';
    case 'harvested': return 'bg-blue-500 text-white';
    case 'planned': return 'bg-purple-500 text-white';
    case 'maintenance': return 'bg-yellow-500 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

// Instance method to get label color class
gallerySchema.methods.getLabelColor = function(): string {
  switch (this.label.toLowerCase()) {
    case 'before': return 'bg-muted text-muted-foreground';
    case 'drone': return 'bg-primary text-primary-foreground';
    case 'harvest': return 'bg-bright-green text-bright-green-foreground';
    case 'progress': return 'bg-blue-500 text-white';
    case 'equipment': return 'bg-gray-500 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

// Static method to get all unique crops
gallerySchema.statics.getUniqueCrops = function() {
  return this.distinct('crop');
};

// Static method to get all unique regions
gallerySchema.statics.getUniqueRegions = function() {
  return this.distinct('region');
};

// Static method to get images by plot ID
gallerySchema.statics.getByPlotId = function(plotId: number) {
  return this.find({ plotId, isActive: true }).sort({ date: -1 });
};

// Export the model
export default mongoose.model<IGallery>('Gallery', gallerySchema);
