import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery';
import { seedGallery } from '../utils/seedGallery';

// GET /api/gallery (Public - published items only)
export const listPublicGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };

    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gallery items: ' + (error as Error).message,
    });
  }
};

// GET /api/admin/gallery (Admin - includes drafts & filters)
export const listAdminGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (category && typeof category === 'string' && category !== 'all') {
      filter.category = category;
    }

    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin gallery: ' + (error as Error).message,
    });
  }
};

// GET /api/gallery/:id or /api/admin/gallery/:id
export const getGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Gallery photo not found' });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve photo: ' + (error as Error).message,
    });
  }
};

// POST /api/admin/gallery
export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, caption, imageUrl, category, isPublished, displayOrder } = req.body;

    if (!title || !imageUrl) {
      res.status(400).json({ success: false, error: 'Title and Image URL are required' });
      return;
    }

    const item = await Gallery.create({
      title,
      caption: caption || '',
      imageUrl,
      category: category || 'Moments',
      isPublished: isPublished !== undefined ? isPublished : true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery photo added successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create gallery photo: ' + (error as Error).message,
    });
  }
};

// PUT /api/admin/gallery/:id
export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ success: false, error: 'Gallery photo not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Gallery photo updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update gallery photo: ' + (error as Error).message,
    });
  }
};

// DELETE /api/admin/gallery/:id
export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Gallery photo not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Gallery photo removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete gallery photo: ' + (error as Error).message,
    });
  }
};

// PATCH /api/admin/gallery/:id/publish
export const togglePublishGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Gallery photo not found' });
      return;
    }

    const nextState = req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : !item.isPublished;
    item.isPublished = nextState;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Photo is now ${nextState ? 'published' : 'saved as draft'}`,
      isPublished: nextState,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle publish status: ' + (error as Error).message,
    });
  }
};

// POST /api/admin/gallery/seed
export const seedGalleryEndpoint = async (_req: Request, res: Response): Promise<void> => {
  try {
    await seedGallery(true);
    const count = await Gallery.countDocuments();
    res.status(200).json({
      success: true,
      message: `Reset and seeded ${count} gallery photos`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to seed gallery: ' + (error as Error).message,
    });
  }
};
