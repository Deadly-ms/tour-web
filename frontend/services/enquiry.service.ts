import { API_BASE_URL } from '@/services/api';

export interface TripEnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  destination: string;
  tourSlug?: string;
  tourTitle?: string;
  duration?: string;
  travelers?: string;
  travelStyle?: string;
  travelDate?: string;
  notes?: string;
  /** Honeypot field - must stay empty for real users */
  website?: string;
}

/**
 * Send a "Plan Your Journey" / tour enquiry to the backend.
 * Throws an Error with a user-friendly message when the request fails.
 */
export async function submitTripEnquiry(payload: TripEnquiryPayload): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Could not reach the server. Please check your connection and try again.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not send your request. Please try again.');
  }
}