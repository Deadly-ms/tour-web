import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';
import { TourPackage, TourFilterParams } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Public: Fetch all published tour packages
 */
export async function getAllTourPackages(): Promise<TourPackage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/tours`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[TourService] Failed to load tours from API, falling back to mock data:', err);
  }
  return [...MOCK_TOUR_PACKAGES];
}

/**
 * Public: Fetch featured tour packages
 */
export async function getFeaturedTourPackages(): Promise<TourPackage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/tours?featured=true`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[TourService] Failed to load featured tours from API:', err);
  }
  return MOCK_TOUR_PACKAGES.filter((pkg) => pkg.featured);
}

/**
 * Public: Fetch single tour package by slug
 */
export async function getTourPackageBySlug(
  slug: string
): Promise<TourPackage | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/tours/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`[TourService] Failed to fetch tour "${slug}" from API:`, err);
  }
  return MOCK_TOUR_PACKAGES.find((pkg) => pkg.slug === slug);
}

/**
 * Public: Search tour packages with filter params
 */
export async function searchTourPackages(
  params: TourFilterParams
): Promise<TourPackage[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.destination) queryParams.append('destination', params.destination);
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.duration) queryParams.append('duration', params.duration);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE_URL}/tours?${queryParams.toString()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[TourService] Search API error, falling back to local search:', err);
  }

  // Fallback local search
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
        results.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }
  }

  return results;
}

// ==========================================
// Admin CRUD Operations
// ==========================================

const getAuthHeaders = (token?: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Admin: List all tour packages (including drafts)
 */
export async function adminListTours(
  token?: string | null,
  options?: { search?: string; status?: string; category?: string }
): Promise<{ success: boolean; data: TourPackage[]; count: number; error?: string }> {
  try {
    const query = new URLSearchParams();
    if (options?.search) query.append('search', options.search);
    if (options?.status) query.append('status', options.status);
    if (options?.category) query.append('category', options.category);

    const res = await fetch(`${API_BASE_URL}/admin/tours?${query.toString()}`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch admin tours');
    }

    return {
      success: true,
      data: json.data || [],
      count: json.count || 0,
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      count: 0,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Get single tour package by ID
 */
export async function adminGetTour(
  id: string,
  token?: string | null
): Promise<{ success: boolean; data?: TourPackage; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/tours/${id}`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch tour');
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Create a new tour package
 */
export async function adminCreateTour(
  tourData: Partial<TourPackage>,
  token?: string | null
): Promise<{ success: boolean; data?: TourPackage; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/tours`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(tourData),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to create tour package');
    }

    return {
      success: true,
      data: json.data,
      message: json.message || 'Tour package created successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Update existing tour package
 */
export async function adminUpdateTour(
  id: string,
  tourData: Partial<TourPackage>,
  token?: string | null
): Promise<{ success: boolean; data?: TourPackage; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/tours/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(tourData),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update tour package');
    }

    return {
      success: true,
      data: json.data,
      message: json.message || 'Tour package updated successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Delete tour package
 */
export async function adminDeleteTour(
  id: string,
  token?: string | null
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/tours/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to delete tour package');
    }

    return {
      success: true,
      message: json.message || 'Tour package deleted successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Toggle or set published status
 */
export async function adminTogglePublish(
  id: string,
  isPublished?: boolean,
  token?: string | null
): Promise<{ success: boolean; isPublished?: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/tours/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(isPublished !== undefined ? { isPublished } : {}),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to toggle publish status');
    }

    return {
      success: true,
      isPublished: json.isPublished,
      message: json.message,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Upload image file to Cloudinary
 */
export async function adminUploadImage(
  file: File,
  token?: string | null
): Promise<{ success: boolean; url?: string; public_id?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to upload image');
    }

    return {
      success: true,
      url: json.url,
      public_id: json.public_id,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}
