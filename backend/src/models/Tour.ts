import mongoose, { Schema, Document } from 'mongoose';

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  accommodation?: string;
  accommodationImage?: string;
}

export interface IHotelItem {
  name: string;
  location?: string;
  category?: string;
  image?: string;
  rating?: number;
}

export interface ITour extends Document {
  id: string;
  slug: string;
  title: string;
  destination: string;
  category: string;
  duration: string;
  durationDays: number;
  groupSize: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  heroImage: string;
  gallery: string[];
  overview: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: IItineraryDay[];
  hotels?: IHotelItem[];
  featured: boolean;
  bestSeller: boolean;
  isPublished: boolean;
  tags: string[];
  bestTime?: string;
  tripType?: string;
  startEnd?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const hotelItemSchema = new Schema<IHotelItem>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    category: { type: String, trim: true },
    image: { type: String, trim: true },
    rating: { type: Number, default: 4.9 },
  },
  { _id: false }
);

const itineraryDaySchema = new Schema<IItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    meals: { type: String, trim: true },
    accommodation: { type: String, trim: true },
    accommodationImage: { type: String, trim: true },
  },
  { _id: false }
);

const tourSchema = new Schema<ITour>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      default: 'Heritage & Temples',
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    durationDays: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    groupSize: {
      type: String,
      default: 'Private / Couple / Family',
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
    },
    heroImage: {
      type: String,
      required: true,
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    hotels: {
      type: [hotelItemSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    bestTime: {
      type: String,
      trim: true,
    },
    tripType: {
      type: String,
      trim: true,
      default: 'Private Tour',
    },
    startEnd: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Format output to include 'id' instead of '_id'
tourSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

tourSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Tour = mongoose.model<ITour>('Tour', tourSchema);
export default Tour;
