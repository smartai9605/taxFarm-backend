import express from 'express';
import {
  getAllCrops,
  getActiveCrops,
  getCropBySymbol,
  createCrop,
  updateCrop,
  updateCropStatus,
  deleteCrop,
  seedCrops
} from '../controllers/cropController';

const router = express.Router();

// GET /api/crops - Get all crops
router.get('/', getAllCrops);

// GET /api/crops/active - Get active crops only
router.get('/active', getActiveCrops);

// POST /api/crops/seed - Seed initial crop data
router.post('/seed', seedCrops);

// GET /api/crops/:symbol - Get crop by symbol
router.get('/:symbol', getCropBySymbol);

// POST /api/crops - Create new crop
router.post('/', createCrop);

// PUT /api/crops/:symbol - Update crop by symbol
router.put('/:symbol', updateCrop);

// PUT /api/crops/:symbol/status - Update crop status
router.put('/:symbol/status', updateCropStatus);

// DELETE /api/crops/:symbol - Delete crop by symbol
router.delete('/:symbol', deleteCrop);

export default router;
