import { DestinationItem } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const FALLBACK_DESTINATIONS: DestinationItem[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    slug: 'rajasthan',
    tags: ['Heritage', 'Culture', 'Desert'],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    href: '/tour-packages?destination=Rajasthan',
    order: 1,
    isActive: true,
  },
  {
    id: 'kerala',
    name: 'Kerala',
    slug: 'kerala',
    tags: ['Backwaters', 'Nature', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    href: '/tour-packages?destination=Kerala',
    order: 2,
    isActive: true,
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    slug: 'ladakh',
    tags: ['Mountains', 'Adventure', 'Peace'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages?destination=Ladakh',
    order: 3,
    isActive: true,
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    slug: 'meghalaya',
    tags: ['Clouds', 'Adventure', 'Valleys'],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages?destination=Meghalaya',
    order: 4,
    isActive: true,
  },
  {
    id: 'goa',
    name: 'Goa',
    slug: 'goa',
    tags: ['Beaches', 'Relaxation', 'Nightlife'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages?destination=Goa',
    order: 5,
    isActive: true,
  },
];

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
 * Public: Fetch all active destinations
 */
export async function getPopularDestinations(): Promise<DestinationItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[DestinationService] Failed to load destinations from API, using fallback:', err);
  }
  return FALLBACK_DESTINATIONS;
}

/**
 * Admin: List all destinations (both active and inactive)
 */
export async function adminListDestinations(
  token?: string | null,
  options?: { search?: string; status?: string }
): Promise<{ success: boolean; data: DestinationItem[]; count: number; error?: string }> {
  try {
    const query = new URLSearchParams();
    if (options?.search) query.append('search', options.search);
    if (options?.status) query.append('status', options.status);

    const res = await fetch(`${API_BASE_URL}/admin/destinations?${query.toString()}`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch admin destinations');
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
 * Admin: Create a new destination
 */
export async function adminCreateDestination(
  destinationData: Partial<DestinationItem>,
  token?: string | null
): Promise<{ success: boolean; data?: DestinationItem; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/destinations`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(destinationData),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to create destination');
    }

    return {
      success: true,
      data: json.data,
      message: json.message || 'Destination created successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Update an existing destination
 */
export async function adminUpdateDestination(
  id: string,
  destinationData: Partial<DestinationItem>,
  token?: string | null
): Promise<{ success: boolean; data?: DestinationItem; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/destinations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(destinationData),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update destination');
    }

    return {
      success: true,
      data: json.data,
      message: json.message || 'Destination updated successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Delete a destination
 */
export async function adminDeleteDestination(
  id: string,
  token?: string | null
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/destinations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to delete destination');
    }

    return {
      success: true,
      message: json.message || 'Destination deleted successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Toggle active status
 */
export async function adminToggleActiveDestination(
  id: string,
  isActive?: boolean,
  token?: string | null
): Promise<{ success: boolean; isActive?: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/destinations/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(isActive !== undefined ? { isActive } : {}),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to toggle destination status');
    }

    return {
      success: true,
      isActive: json.isActive,
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
 * Admin: Re-seed default destinations
 */
export async function adminSeedDestinations(
  token?: string | null
): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/destinations/seed`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to seed destinations');
    }

    return {
      success: true,
      count: json.count,
      message: json.message,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}
