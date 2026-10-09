import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Tour } from '../models/Tour';
import { uploadBufferToCloudinary, isCloudinaryConfigured } from '../config/cloudinary';
import { seedTours } from '../utils/seedTours';

/**
 * Generate a clean URL slug from title
 */
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

/**
 * Ensure slug is unique by appending counter if necessary
 */
const getUniqueSlug = async (baseSlug: string, currentId?: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await Tour.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Admin: List all tours (both published and drafts)
 * GET /api/admin/tours
 */
export const listAdminTours = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status, category, sortBy } = req.query;
    const filter: Record<string, unknown> = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { destination: regex },
        { category: regex },
        { tags: regex },
      ];
    }

    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }

    if (category && category !== 'All') {
      filter.category = category as string;
    }

    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === 'price-asc') sortOptions = { price: 1 };
    else if (sortBy === 'price-desc') sortOptions = { price: -1 };
    else if (sortBy === 'rating') sortOptions = { rating: -1 };
    else if (sortBy === 'title') sortOptions = { title: 1 };

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
 * Admin: Get single tour by ID for editing
 * GET /api/admin/tours/:id
 */
export const getAdminTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let tour = null;

    if (mongoose.isValidObjectId(id)) {
      tour = await Tour.findById(id);
    } else {
      tour = await Tour.findOne({ slug: id });
    }

    if (!tour) {
      res.status(404).json({
        success: false,
        message: 'Tour package not found',
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

/**
 * Admin: Create a new tour package
 * POST /api/admin/tours
 */
export const createTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      slug: customSlug,
      destination,
      category,
      duration,
      durationDays,
      groupSize,
      price,
      originalPrice,
      discountPercent,
      heroImage,
      gallery,
      overview,
      inclusions,
      exclusions,
      itinerary,
      hotels,
      featured,
      bestSeller,
      isPublished,
      tags,
      bestTime,
      tripType,
      startEnd,
    } = req.body;

    if (!title || !destination || !price || !heroImage || !overview) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: title, destination, price, heroImage, and overview are mandatory.',
      });
      return;
    }

    // Determine unique slug
    const baseSlug = (customSlug && customSlug.trim() !== '')
      ? generateSlug(customSlug)
      : generateSlug(title);
    const slug = await getUniqueSlug(baseSlug);

    // Compute numeric discount percentage if not provided
    const numericPrice = Number(price);
    const numericOrigPrice = originalPrice ? Number(originalPrice) : undefined;
    let computedDiscount = discountPercent ? Number(discountPercent) : undefined;
    if (!computedDiscount && numericOrigPrice && numericOrigPrice > numericPrice) {
      computedDiscount = Math.round(((numericOrigPrice - numericPrice) / numericOrigPrice) * 100);
    }

    // Determine durationDays
    let parsedDays = Number(durationDays);
    if (!parsedDays || isNaN(parsedDays)) {
      const match = (duration || '').match(/(\d+)\s*Day/i);
      parsedDays = match ? parseInt(match[1], 10) : 1;
    }

    const newTour = new Tour({
      slug,
      title: title.trim(),
      destination: destination.trim(),
      category: category || 'Heritage & Temples',
      duration: duration || `${parsedDays} Days`,
      durationDays: parsedDays,
      groupSize: groupSize || 'Private / Couple / Family',
      rating: req.body.rating ? Number(req.body.rating) : 4.9,
      reviewsCount: req.body.reviewsCount ? Number(req.body.reviewsCount) : 0,
      price: numericPrice,
      originalPrice: numericOrigPrice,
      discountPercent: computedDiscount,
      heroImage: heroImage.trim(),
      gallery: Array.isArray(gallery) ? gallery.filter(Boolean) : [],
      overview: overview.trim(),
      inclusions: Array.isArray(inclusions) ? inclusions.filter(Boolean) : [],
      exclusions: Array.isArray(exclusions) ? exclusions.filter(Boolean) : [],
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      hotels: Array.isArray(hotels) ? hotels : [],
      featured: Boolean(featured),
      bestSeller: Boolean(bestSeller),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      bestTime: bestTime?.trim(),
      tripType: tripType?.trim() || 'Private Tour',
      startEnd: startEnd?.trim(),
      createdBy: req.adminId,
    });

    await newTour.save();

    res.status(201).json({
      success: true,
      message: 'Tour package created successfully',
      data: newTour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update existing tour package
 * PUT /api/admin/tours/:id
 */
export const updateTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let tour = null;

    if (mongoose.isValidObjectId(id)) {
      tour = await Tour.findById(id);
    } else {
      tour = await Tour.findOne({ slug: id });
    }

    if (!tour) {
      res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
      return;
    }

    const {
      title,
      slug: customSlug,
      destination,
      category,
      duration,
      durationDays,
      groupSize,
      rating,
      reviewsCount,
      price,
      originalPrice,
      discountPercent,
      heroImage,
      gallery,
      overview,
      inclusions,
      exclusions,
      itinerary,
      hotels,
      featured,
      bestSeller,
      isPublished,
      tags,
      bestTime,
      tripType,
      startEnd,
    } = req.body;

    if (title) tour.title = title.trim();
    if (destination) tour.destination = destination.trim();
    if (category) tour.category = category;
    if (duration) tour.duration = duration.trim();
    if (durationDays !== undefined) tour.durationDays = Number(durationDays);
    if (groupSize !== undefined) tour.groupSize = groupSize;
    if (rating !== undefined) tour.rating = Number(rating);
    if (reviewsCount !== undefined) tour.reviewsCount = Number(reviewsCount);
    if (price !== undefined) tour.price = Number(price);
    if (originalPrice !== undefined) tour.originalPrice = Number(originalPrice);
    if (heroImage) tour.heroImage = heroImage.trim();
    if (gallery !== undefined) tour.gallery = Array.isArray(gallery) ? gallery.filter(Boolean) : [];
    if (overview) tour.overview = overview.trim();
    if (inclusions !== undefined) tour.inclusions = Array.isArray(inclusions) ? inclusions.filter(Boolean) : [];
    if (exclusions !== undefined) tour.exclusions = Array.isArray(exclusions) ? exclusions.filter(Boolean) : [];
    if (itinerary !== undefined) tour.itinerary = Array.isArray(itinerary) ? itinerary : [];
    if (hotels !== undefined) tour.hotels = Array.isArray(hotels) ? hotels : [];
    if (featured !== undefined) tour.featured = Boolean(featured);
    if (bestSeller !== undefined) tour.bestSeller = Boolean(bestSeller);
    if (isPublished !== undefined) tour.isPublished = Boolean(isPublished);
    if (tags !== undefined) tour.tags = Array.isArray(tags) ? tags.filter(Boolean) : [];
    if (bestTime !== undefined) tour.bestTime = bestTime;
    if (tripType !== undefined) tour.tripType = tripType;
    if (startEnd !== undefined) tour.startEnd = startEnd;

    // Handle slug change if provided
    if (customSlug && customSlug.trim() !== '' && customSlug !== tour.slug) {
      const baseSlug = generateSlug(customSlug);
      tour.slug = await getUniqueSlug(baseSlug, tour._id.toString());
    }

    // Recalculate discount
    if (discountPercent !== undefined) {
      tour.discountPercent = Number(discountPercent);
    } else if (tour.originalPrice && tour.originalPrice > tour.price) {
      tour.discountPercent = Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100);
    }

    await tour.save();

    res.json({
      success: true,
      message: 'Tour package updated successfully',
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete tour package
 * DELETE /api/admin/tours/:id
 */
export const deleteTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let tour = null;

    if (mongoose.isValidObjectId(id)) {
      tour = await Tour.findByIdAndDelete(id);
    } else {
      tour = await Tour.findOneAndDelete({ slug: id });
    }

    if (!tour) {
      res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
      return;
    }

    res.json({
      success: true,
      message: `Tour "${tour.title}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Toggle or set published status
 * PATCH /api/admin/tours/:id/publish
 */
export const togglePublishTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    let tour = null;

    if (mongoose.isValidObjectId(id)) {
      tour = await Tour.findById(id);
    } else {
      tour = await Tour.findOne({ slug: id });
    }

    if (!tour) {
      res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
      return;
    }

    if (req.body.isPublished !== undefined) {
      tour.isPublished = Boolean(req.body.isPublished);
    } else {
      tour.isPublished = !tour.isPublished;
    }

    await tour.save();

    res.json({
      success: true,
      message: `Tour package is now ${tour.isPublished ? 'published (live)' : 'hidden (draft)'}`,
      isPublished: tour.isPublished,
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Force re-seed or initial seed default tours
 * POST /api/admin/tours/seed
 */
export const seedToursEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const force = req.query.force === 'true' || req.body.force === true;
    const count = await seedTours(force);

    res.json({
      success: true,
      message: `Database seeded with ${count} tour packages.`,
      count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Upload image to Cloudinary
 * POST /api/admin/upload
 */
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please include a file in the "image" field.',
      });
      return;
    }

    if (!isCloudinaryConfigured()) {
      res.status(503).json({
        success: false,
        message:
          'Cloudinary is not yet configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env. Alternatively, you can paste direct image URLs.',
      });
      return;
    }

    const folder = (req.body.folder as string) || 'wanderly/tours';
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Cloudinary upload failed: ${(error as Error).message}`,
    });
  }
};
