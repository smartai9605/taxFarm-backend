import { Request, Response } from 'express';
import Gallery, { IGallery } from '../models/Gallery';

// Get all gallery images
export const getAllGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const images = await Gallery.find({ isActive: true }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get gallery images with filters
export const getFilteredGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, status, region, label, plotId } = req.query;
    
    // Build filter object
    const filter: any = { isActive: true };
    
    if (crop && crop !== 'all') {
      filter.crop = new RegExp(crop as string, 'i');
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (region && region !== 'all') {
      filter.region = region;
    }
    if (label && label !== 'all') {
      filter.label = label;
    }
    if (plotId) {
      filter.plotId = parseInt(plotId as string);
    }
    
    const images = await Gallery.find(filter).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
      filters: { crop, status, region, label, plotId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filtered gallery images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get gallery image by ID
export const getGalleryImageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get gallery images by plot ID
export const getGalleryImagesByPlotId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { plotId } = req.params;
    const images = await Gallery.find({ plotId: parseInt(plotId), isActive: true }).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: images.length,
      plotId: parseInt(plotId),
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images for plot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new gallery image
export const createGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const imageData = req.body;
    
    const image = new Gallery(imageData);
    await image.save();
    
    res.status(201).json({
      success: true,
      message: 'Gallery image created successfully',
      data: image
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update gallery image by ID
export const updateGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const image = await Gallery.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery image updated successfully',
      data: image
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete gallery image by ID (soft delete)
export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Hard delete gallery image by ID
export const hardDeleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findByIdAndDelete(id);
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery image permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get unique filter options
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const [crops, regions] = await Promise.all([
      Gallery.distinct('crop'),
      Gallery.distinct('region')
    ]);
    
    const statuses = ['Acquired', 'Cultivation', 'Harvested', 'Planned', 'Maintenance'];
    const labels = ['Before', 'Drone', 'Harvest', 'Progress', 'Equipment'];
    
    res.status(200).json({
      success: true,
      data: {
        crops: crops.sort(),
        regions: regions.sort(),
        statuses,
        labels
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Seed initial gallery data from frontend
export const seedGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if gallery images already exist
    const existingImages = await Gallery.countDocuments();
    if (existingImages > 0) {
      res.status(400).json({
        success: false,
        message: 'Gallery images already seeded. Use individual endpoints to add more images.'
      });
      return;
    }
    
    // Initial gallery data based on your frontend
    const initialImages = [
      {
        plotName: "Green Valley Farm",
        plotId: 1,
        status: "Cultivation",
        crop: "Potatoes",
        region: "Midwest",
        label: "Drone",
        caption: "Aerial view of our 247-acre potato cultivation showing healthy crop growth during peak season.",
        date: new Date("2024-08-15"),
        image: "/assets/gallery/drone-1.jpg"
      },
      {
        plotName: "Sunny Acres",
        plotId: 2,
        status: "Acquired",
        crop: "Corn",
        region: "Midwest",
        label: "Before",
        caption: "Freshly acquired 156-acre plot prepared for corn planting in the upcoming spring season.",
        date: new Date("2024-03-10"),
        image: "/assets/gallery/before-1.jpg"
      },
      {
        plotName: "Mountain View Ranch",
        plotId: 3,
        status: "Harvested",
        crop: "Wheat",
        region: "Northwest",
        label: "Harvest",
        caption: "Successful wheat harvest from our 312-acre plot yielding exceptional quality grain.",
        date: new Date("2024-09-22"),
        image: "/assets/gallery/harvest-1.jpg"
      },
      {
        plotName: "Riverside Farm",
        plotId: 4,
        status: "Cultivation",
        crop: "Avocados",
        region: "Southwest",
        label: "Drone",
        caption: "Drone footage of our organic avocado orchard showing mature trees ready for year-round harvest.",
        date: new Date("2024-07-30"),
        image: "/assets/gallery/drone-2.jpg"
      },
      {
        plotName: "Prairie Fields",
        plotId: 5,
        status: "Acquired",
        crop: "Soybeans",
        region: "Southeast",
        label: "Before",
        caption: "Newly acquired 89-acre field being prepared for soybean cultivation with sustainable farming practices.",
        date: new Date("2024-04-05"),
        image: "/assets/gallery/before-2.jpg"
      },
      {
        plotName: "Golden Plains",
        plotId: 6,
        status: "Harvested",
        crop: "Corn",
        region: "Midwest",
        label: "Harvest",
        caption: "Corn harvest season in full swing with high-quality grain being collected and processed.",
        date: new Date("2024-10-12"),
        image: "/assets/gallery/harvest-2.jpg"
      }
    ];
    
    const createdImages = await Gallery.insertMany(initialImages);
    
    res.status(201).json({
      success: true,
      message: 'Gallery images seeded successfully',
      count: createdImages.length,
      data: createdImages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error seeding gallery images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get gallery statistics
export const getGalleryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalImages,
      imagesByStatus,
      imagesByRegion,
      imagesByLabel,
      recentImages
    ] = await Promise.all([
      Gallery.countDocuments({ isActive: true }),
      Gallery.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Gallery.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$region', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Gallery.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$label', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Gallery.find({ isActive: true }).sort({ date: -1 }).limit(5)
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalImages,
        breakdown: {
          byStatus: imagesByStatus,
          byRegion: imagesByRegion,
          byLabel: imagesByLabel
        },
        recentImages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
