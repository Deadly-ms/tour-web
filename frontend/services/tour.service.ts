import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';
import { TourPackage, TourFilterParams } from '@/types';

export async function getAllTourPackages(): Promise<TourPackage[]> {
  return [...MOCK_TOUR_PACKAGES];
}

export async function getFeaturedTourPackages(): Promise<TourPackage[]> {
  return MOCK_TOUR_PACKAGES.filter((pkg) => pkg.featured);
}

export async function getTourPackageBySlug(slug: string): Promise<TourPackage | undefined> {
  return MOCK_TOUR_PACKAGES.find((pkg) => pkg.slug === slug);
}

export async function searchTourPackages(params: TourFilterParams): Promise<TourPackage[]> {
  let results = [...MOCK_TOUR_PACKAGES];

  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.overview.toLowerCase().includes(q)
    );
  }

  if (params.category && params.category !== 'All') {
    results = results.filter((p) => p.category === params.category);
  }

  if (params.minPrice) {
    results = results.filter((p) => p.price >= (params.minPrice || 0));
  }

  if (params.maxPrice) {
    results = results.filter((p) => p.price <= (params.maxPrice || Infinity));
  }

  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        results.sort((a, b) => b.durationDays - a.durationDays);
        break;
      default:
        // recommended
        results.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }
  }

  return results;
}
