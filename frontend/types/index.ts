/**
 * Core Type Definitions for Tour Platform
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface HealthResponse {
  success: boolean;
  message: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  accommodation?: string;
}

export interface TourPackage {
  id: string;
  _id?: string;
  slug: string;
  title: string;
  destination: string;
  category: 'Hill Station' | 'Heritage & Temples' | 'Coastal & Backwaters' | 'Wildlife & Nature' | 'Honeymoon' | 'Adventure' | string;
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
  itinerary: ItineraryDay[];
  featured?: boolean;
  bestSeller?: boolean;
  isPublished?: boolean;
  tags?: string[];
  bestTime?: string;
  tripType?: string;
  startEnd?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  tripName: string;
}

export interface TourFilterParams {
  query?: string;
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  sortBy?: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'duration';
}

export interface BookingRequest {
  packageId: string;
  packageTitle: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  travelers: number;
  specialRequests?: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  destination?: string;
  message: string;
}
