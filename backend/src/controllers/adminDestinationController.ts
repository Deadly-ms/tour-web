import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Destination } from '../models/Destination';
import { DEFAULT_INITIAL_DESTINATIONS } from './destinationController';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const getUniqueSlug = async (baseSlug: string, currentId?: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await Destination.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Admin: List all destinations
 * GET /api/admin/destinations
 */
export const listAdminDestinations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { tags: regex }, { slug: regex }];
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const destinations = await Destination.find(filter).sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create new destination
 * POST /api/admin/destinations
 */
export const createDestination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, image, tags, href, order, isActive, customSlug } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Destination name is required',
      });
      return;
    }

    if (!image || typeof image !== 'string' || image.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Cover image URL is required',
      });
      return;
    }

    const trimmedName = name.trim();
    const baseSlug = customSlug && typeof customSlug === 'string' && customSlug.trim() !== ''
      ? generateSlug(customSlug)
      : generateSlug(trimmedName);
    const slug = await getUniqueSlug(baseSlug);

    const parsedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim()).filter(Boolean)
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const defaultHref = `/tour-packages?destination=${encodeURIComponent(trimmedName)}`;

    const destination = new Destination({
      name: trimmedName,
      slug,
      image: image.trim(),
      tags: parsedTags,
      href: href && href.trim() !== '' ? href.trim() : defaultHref,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    await destination.save();

    res.status(201).json({
      success: true,
      message: `Destination "${destination.name}" created successfully`,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update destination
 * PUT /api/admin/destinations/:id
 */
export const updateDestination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let destination = null;

    if (mongoose.isValidObjectId(id)) {
      destination = await Destination.findById(id);
    } else {
      destination = await Destination.findOne({ slug: id });
    }

    if (!destination) {
      res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
      return;
    }

    const { name, image, tags, href, order, isActive, customSlug } = req.body;

    if (name !== undefined && name.trim() !== '') {
      destination.name = name.trim();
    }

    if (image !== undefined && image.trim() !== '') {
      destination.image = image.trim();
    }

    if (tags !== undefined) {
      destination.tags = Array.isArray(tags)
        ? tags.map((t: string) => t.trim()).filter(Boolean)
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
    }

    if (href !== undefined) {
      destination.href = href.trim() !== '' ? href.trim() : `/tour-packages?destination=${encodeURIComponent(destination.name)}`;
    }

    if (order !== undefined) {
      destination.order = Number(order);
    }

    if (isActive !== undefined) {
      destination.isActive = Boolean(isActive);
    }

    if (customSlug && customSlug.trim() !== '' && customSlug !== destination.slug) {
      const baseSlug = generateSlug(customSlug);
      destination.slug = await getUniqueSlug(baseSlug, destination._id.toString());
    }

    await destination.save();

    res.json({
      success: true,
      message: `Destination "${destination.name}" updated successfully`,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete destination
 * DELETE /api/admin/destinations/:id
 */
export const deleteDestination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let destination = null;

    if (mongoose.isValidObjectId(id)) {
      destination = await Destination.findByIdAndDelete(id);
    } else {
      destination = await Destination.findOneAndDelete({ slug: id });
    }

    if (!destination) {
      res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
      return;
    }

    res.json({
      success: true,
      message: `Destination "${destination.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Toggle destination active status
 * PATCH /api/admin/destinations/:id/toggle
 */
export const toggleActiveDestination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let destination = null;

    if (mongoose.isValidObjectId(id)) {
      destination = await Destination.findById(id);
    } else {
      destination = await Destination.findOne({ slug: id });
    }

    if (!destination) {
      res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
      return;
    }

    if (req.body.isActive !== undefined) {
      destination.isActive = Boolean(req.body.isActive);
    } else {
      destination.isActive = !destination.isActive;
    }

    await destination.save();

    res.json({
      success: true,
      message: `Destination is now ${destination.isActive ? 'active (shown on site)' : 'hidden'}`,
      isActive: destination.isActive,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Re-seed default destinations
 * POST /api/admin/destinations/seed
 */
export const seedDestinationsEndpoint = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Destination.deleteMany({});
    const inserted = await Destination.insertMany(DEFAULT_INITIAL_DESTINATIONS);

    res.json({
      success: true,
      message: `Successfully seeded ${inserted.length} default destinations`,
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
