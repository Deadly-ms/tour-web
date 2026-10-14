import { Request, Response, NextFunction } from 'express';
import { Destination } from '../models/Destination';

export const DEFAULT_INITIAL_DESTINATIONS = [
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    tags: ['Heritage', 'Culture', 'Desert'],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    href: '/tour-packages?destination=Rajasthan',
    order: 1,
    isActive: true,
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    tags: ['Backwaters', 'Nature', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    href: '/tour-packages?destination=Kerala',
    order: 2,
    isActive: true,
  },
  {
    name: 'Ladakh',
    slug: 'ladakh',
    tags: ['Mountains', 'Adventure', 'Peace'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages?destination=Ladakh',
    order: 3,
    isActive: true,
  },
  {
    name: 'Meghalaya',
    slug: 'meghalaya',
    tags: ['Clouds', 'Adventure', 'Valleys'],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages?destination=Meghalaya',
    order: 4,
    isActive: true,
  },
  {
    name: 'Goa',
    slug: 'goa',
    tags: ['Beaches', 'Relaxation', 'Nightlife'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages?destination=Goa',
    order: 5,
    isActive: true,
  },
];

/**
 * Public: Get all active destinations for homepage & discovery
 * GET /api/destinations
 */
export const getDestinations = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      // Auto seed default destinations so homepage is immediately populated
      await Destination.insertMany(DEFAULT_INITIAL_DESTINATIONS);
    }

    const destinations = await Destination.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });

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
 * Public: Get single destination by slug
 * GET /api/destinations/:slug
 */
export const getDestinationBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const destination = await Destination.findOne({ slug, isActive: true });

    if (!destination) {
      res.status(404).json({
        success: false,
        message: `Destination with slug "${slug}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};
