import { GalleryItem } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Build auth headers with Clerk JWT token
 */
function getAuthHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Public: Fetch all published gallery photos
 */
export async function getPublicGallery(
  category?: string
): Promise<{ success: boolean; data: GalleryItem[]; count: number; error?: string }> {
  try {
    const url = new URL(`${API_BASE_URL}/gallery`);
    if (category) {
      url.searchParams.append('category', category);
    }

    const res = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch gallery: ${res.statusText}`);
    }

    const json = await res.json();
    return {
      success: true,
      data: json.data || [],
      count: json.count || 0,
    };
  } catch (err) {
    console.error('getPublicGallery error:', err);
    return {
      success: false,
      data: [],
      count: 0,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Fetch all gallery photos with optional search, category, or status filters
 */
export async function adminListGallery(
  token?: string | null,
  params?: { search?: string; category?: string; status?: string }
): Promise<{
  success: boolean;
  data: GalleryItem[];
  count: number;
  total: number;
  published: number;
  error?: string;
}> {
  try {
    const url = new URL(`${API_BASE_URL}/admin/gallery`);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.status) url.searchParams.append('status', params.status);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch admin gallery');
    }

    const items = json.data || [];
    const total =
      typeof json.total === 'number'
        ? json.total
        : (typeof json.count === 'number' ? json.count : items.length);
    const published =
      typeof json.published === 'number'
        ? json.published
        : items.filter((it: GalleryItem) => it.isPublished !== false).length;

    return {
      success: true,
      data: items,
      count: typeof json.count === 'number' ? json.count : items.length,
      total,
      published,
    };
  } catch (err) {
    console.error('adminListGallery error:', err);
    return {
      success: false,
      data: [],
      count: 0,
      total: 0,
      published: 0,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Get single gallery photo by ID
 */
export async function adminGetGallery(
  id: string,
  token?: string | null
): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch gallery photo');
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
 * Admin: Create new gallery photo
 */
export async function adminCreateGallery(
  data: Partial<GalleryItem>,
  token?: string | null
): Promise<{ success: boolean; data?: GalleryItem; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to add photo to gallery');
    }

    return {
      success: true,
      data: json.data,
      message: json.message || 'Photo added successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Update existing gallery photo
 */
export async function adminUpdateGallery(
  id: string,
  data: Partial<GalleryItem>,
  token?: string | null
): Promise<{ success: boolean; data?: GalleryItem; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update gallery photo');
    }

    return {
      success: true,
      data: json.data,
      message: json.message || 'Photo updated successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Admin: Delete gallery photo
 */
export async function adminDeleteGallery(
  id: string,
  token?: string | null
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to delete gallery photo');
    }

    return {
      success: true,
      message: json.message || 'Photo deleted successfully',
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
export async function adminTogglePublishGallery(
  id: string,
  isPublished?: boolean,
  token?: string | null
): Promise<{ success: boolean; isPublished?: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gallery/${id}/publish`, {
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
 * Admin: Seed or re-seed default gallery photos
 */
export async function adminSeedGallery(
  force: boolean = false,
  token?: string | null
): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gallery/seed`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ force }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to seed gallery');
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
