import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Tour } from '../models/Tour';

/**
 * Public: Get all published tours with optional filtering and sorting
 * GET /api/tours
 */
export const getTours = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      query,
      search,
      destination,
      category,
      minPrice,
      maxPrice,
      duration,
      featured,
      sortBy,
    } = req.query;

    const filter: Record<string, unknown> = {
      isPublished: true,
    };

    // Text search filter
    const searchTerm = (query || search) as string;
    if (searchTerm && searchTerm.trim() !== '') {
      const regex = new RegExp(searchTerm.trim(), 'i');
      filter.$or = [
        { title: regex },
        { destination: regex },
        { overview: regex },
        { tags: regex },
      ];
    }

    // Destination filter
    if (destination && destination !== 'All') {
      filter.destination = new RegExp(destination as string, 'i');
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category as string;
    }

    // Price filter
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter.price = priceFilter;
    }

    // Duration filter
    if (duration && duration !== 'All') {
      if (duration === 'short') {
        filter.durationDays = { $lte: 4 };
      } else if (duration === 'medium') {
        filter.durationDays = { $gte: 5, $lte: 7 };
      } else if (duration === 'long') {
        filter.durationDays = { $gte: 8 };
      }
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Sorting
    let sortOptions: Record<string, 1 | -1> = { bestSeller: -1, rating: -1, createdAt: -1 };
    if (sortBy === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sortBy === 'duration') {
      sortOptions = { durationDays: -1 };
    }

    const tours = await Tour.find(filter).sort(sortOptions);

    res.json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get single tour by slug (or fallback to _id)
 * GET /api/tours/:slug
 */
export const getTourBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    let tour = await Tour.findOne({ slug, isPublished: true });

    // Fallback search by ID if valid ObjectId
    if (!tour && mongoose.isValidObjectId(slug)) {
      tour = await Tour.findOne({ _id: slug, isPublished: true });
    }

    if (!tour) {
      res.status(404).json({
        success: false,
        message: `Tour package with slug "${slug}" not found or is unpublished`,
      });
      return;
    }

    res.json({
      success: true,
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};
