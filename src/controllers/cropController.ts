import { Request, Response } from 'express';
import Crop, { ICrop } from '../models/Crops';

// Get all crops
export const getAllCrops = async (req: Request, res: Response): Promise<void> => {
  try {
    const crops = await Crop.find();
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching crops',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get active crops only
export const getActiveCrops = async (req: Request, res: Response): Promise<void> => {
  try {
    const crops = await Crop.find({ status: 'Active', isActive: true });
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active crops',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get crop by symbol
export const getCropBySymbol = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const crop = await Crop.findOne({ symbol: symbol.toUpperCase() });
    
    if (!crop) {
      res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching crop',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new crop
export const createCrop = async (req: Request, res: Response): Promise<void> => {
  try {
    const cropData = req.body;
    
    // Check if crop with same name or symbol already exists
    const existingCrop = await Crop.findOne({
      $or: [
        { name: cropData.name },
        { symbol: cropData.symbol }
      ]
    });
    
    if (existingCrop) {
      res.status(400).json({
        success: false,
        message: 'Crop with this name or symbol already exists'
      });
      return;
    }
    
    const crop = new Crop(cropData);
    await crop.save();
    
    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      data: crop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating crop',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update crop by symbol
export const updateCrop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const updates = req.body;
    
    const crop = await Crop.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!crop) {
      res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: crop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating crop',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update crop status
export const updateCropStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { status } = req.body;
    
    if (!status || !['Active', 'Coming Soon', 'Completed', 'Paused'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Valid status is required (Active, Coming Soon, Completed, Paused)'
      });
      return;
    }
    
    const crop = await Crop.findOne({ symbol: symbol.toUpperCase() });
    
    if (!crop) {
      res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
      return;
    }
    
    crop.status = status;
    await crop.save(); // This will trigger the pre-save middleware to update isActive
    
    res.status(200).json({
      success: true,
      message: 'Crop status updated successfully',
      data: crop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating crop status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete crop by symbol
export const deleteCrop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    
    const crop = await Crop.findOneAndDelete({ symbol: symbol.toUpperCase() });
    
    if (!crop) {
      res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting crop',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Seed initial crop data from frontend
export const seedCrops = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if crops already exist
    const existingCrops = await Crop.countDocuments();
    if (existingCrops > 0) {
      res.status(400).json({
        success: false,
        message: 'Crops already seeded. Use individual endpoints to add more crops.'
      });
      return;
    }
    
    // Initial crop data based on your frontend
    const initialCrops = [
      {
        name: "$POTATO",
        symbol: "SPOTATO",
        crop: "Premium Potatoes",
        image: "/assets/potato-crop.jpg",
        landArea: "247 acres",
        yieldSeason: "Sep - Nov 2024",
        status: "Active",
        tvl: "$142,000",
        apy: "12.4%",
        yieldLogic: "Harvest revenue distributed proportionally to token holders",
        bgColor: "bg-bright-green",
        statusColor: "bg-green-500"
      },
      {
        name: "$AVOCADO",
        symbol: "SAVOCADO",
        crop: "Organic Avocados",
        image: "/assets/avocado-crop.jpg",
        landArea: "89 acres",
        yieldSeason: "Year-round",
        status: "Active",
        tvl: "$89,500",
        apy: "15.2%",
        yieldLogic: "Monthly harvest yields shared among all token holders",
        bgColor: "bg-accent",
        statusColor: "bg-green-500"
      },
      {
        name: "$CORN",
        symbol: "SCORN",
        crop: "Sweet Corn",
        image: "/assets/corn-crop.jpg",
        landArea: "156 acres",
        yieldSeason: "Aug - Oct 2024",
        status: "Coming Soon",
        tvl: "TBD",
        apy: "Est. 11.8%",
        yieldLogic: "Seasonal harvest profits distributed to holders quarterly",
        bgColor: "bg-orange",
        statusColor: "bg-yellow-500"
      },
      {
        name: "$WHEAT",
        symbol: "SWHEAT",
        crop: "Golden Wheat",
        image: "/assets/wheat-crop.jpg",
        landArea: "312 acres",
        yieldSeason: "Jun - Aug 2024",
        status: "Coming Soon",
        tvl: "TBD",
        apy: "Est. 10.5%",
        yieldLogic: "Annual wheat sales revenue shared proportionally with token holders",
        bgColor: "bg-peach",
        statusColor: "bg-yellow-500"
      }
    ];
    
    const createdCrops = await Crop.insertMany(initialCrops);
    
    res.status(201).json({
      success: true,
      message: 'Crops seeded successfully',
      count: createdCrops.length,
      data: createdCrops
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error seeding crops',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
