import express from 'express';
import {
  getAllGalleryImages,
  getFilteredGalleryImages,
  getGalleryImageById,
  getGalleryImagesByPlotId,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  hardDeleteGalleryImage,
  getFilterOptions,
  seedGalleryImages,
  getGalleryStats
} from '../controllers/galleryController';

const router = express.Router();

// GET /api/gallery - Get all gallery images
router.get('/', getAllGalleryImages);

// GET /api/gallery/filter - Get filtered gallery images
router.get('/filter', getFilteredGalleryImages);

// GET /api/gallery/options - Get filter options (crops, regions, etc.)
router.get('/options', getFilterOptions);

// GET /api/gallery/stats - Get gallery statistics
router.get('/stats', getGalleryStats);

// POST /api/gallery/seed - Seed initial gallery data
router.post('/seed', seedGalleryImages);

// GET /api/gallery/plot/:plotId - Get gallery images by plot ID
router.get('/plot/:plotId', getGalleryImagesByPlotId);

// GET /api/gallery/:id - Get gallery image by ID
router.get('/:id', getGalleryImageById);

// POST /api/gallery - Create new gallery image
router.post('/', createGalleryImage);

// PUT /api/gallery/:id - Update gallery image by ID
router.put('/:id', updateGalleryImage);

// DELETE /api/gallery/:id - Soft delete gallery image by ID
router.delete('/:id', deleteGalleryImage);

// DELETE /api/gallery/:id/hard - Hard delete gallery image by ID
router.delete('/:id/hard', hardDeleteGalleryImage);

export default router;
