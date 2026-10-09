'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/components/ui/Toast';
import { TourPackage, ItineraryDay } from '@/types';
import {
  adminCreateTour,
  adminUpdateTour,
  adminUploadImage,
} from '@/services/tour.service';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Eye,
} from 'lucide-react';

interface TourFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tourToEdit?: TourPackage | null;
}

const CATEGORIES = [
  'Heritage & Temples',
  'Hill Station',
  'Coastal & Backwaters',
  'Wildlife & Nature',
  'Honeymoon',
  'Adventure',
];

export function TourFormModal({
  isOpen,
  onClose,
  onSuccess,
  tourToEdit,
}: TourFormModalProps) {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'itinerary' | 'details'>('basic');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [duration, setDuration] = useState('5 Days / 4 Nights');
  const [durationDays, setDurationDays] = useState<number>(5);
  const [groupSize, setGroupSize] = useState('Private / Couple / Family');
  const [price, setPrice] = useState<number>(19999);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(24999);
  const [discountPercent, setDiscountPercent] = useState<number | undefined>(20);
  const [heroImage, setHeroImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [tags, setTags] = useState('');
  const [tripType, setTripType] = useState('Private Tour');
  const [bestTime, setBestTime] = useState('Oct - Mar');
  const [startEnd, setStartEnd] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);

  const [inclusions, setInclusions] = useState<string[]>([
    'Curated 4-star boutique hotel stays',
    'Daily complimentary breakfast and traditional dinner',
    'Private chauffeur-driven AC vehicle for entire tour',
    'All monument entry tickets and sightseeing permits',
  ]);
  const [newInclusion, setNewInclusion] = useState('');

  const [exclusions, setExclusions] = useState<string[]>([
    'Airfare / Train tickets to destination',
    'Personal expenses, shopping, and laundry',
    'Optional adventure activity fees',
  ]);
  const [newExclusion, setNewExclusion] = useState('');

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      day: 1,
      title: 'Arrival & Welcome Dinner',
      description: 'Chauffeur pickup from the airport/station. Check into hotel and enjoy an evening orientation and welcome dinner.',
      meals: 'Welcome Dinner',
      accommodation: 'Curated Heritage Stay',
    },
    {
      day: 2,
      title: 'Heritage Sightseeing & Local Cultural Walk',
      description: 'Morning guided tour of the key historical landmarks followed by a stroll through the bustling artisan bazaars.',
      meals: 'Breakfast & Dinner',
      accommodation: 'Curated Heritage Stay',
    },
  ]);

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset form when modal opens or tourToEdit changes
  useEffect(() => {
    if (tourToEdit) {
      setTitle(tourToEdit.title || '');
      setSlug(tourToEdit.slug || '');
      setIsSlugManuallyEdited(true);
      setDestination(tourToEdit.destination || '');
      setCategory(tourToEdit.category || CATEGORIES[0]);
      setDuration(tourToEdit.duration || '5 Days / 4 Nights');
      setDurationDays(tourToEdit.durationDays || 5);
      setGroupSize(tourToEdit.groupSize || 'Private / Couple / Family');
      setPrice(tourToEdit.price || 0);
      setOriginalPrice(tourToEdit.originalPrice);
      setDiscountPercent(tourToEdit.discountPercent);
      setHeroImage(tourToEdit.heroImage || '');
      setGallery(tourToEdit.gallery || []);
      setOverview(tourToEdit.overview || '');
      setTags(tourToEdit.tags ? tourToEdit.tags.join(', ') : '');
      setTripType(tourToEdit.tripType || 'Private Tour');
      setBestTime(tourToEdit.bestTime || 'Oct - Mar');
      setStartEnd(tourToEdit.startEnd || '');
      setIsPublished(tourToEdit.isPublished !== undefined ? tourToEdit.isPublished : true);
      setFeatured(Boolean(tourToEdit.featured));
      setBestSeller(Boolean(tourToEdit.bestSeller));
      setInclusions(tourToEdit.inclusions || []);
      setExclusions(tourToEdit.exclusions || []);
      setItinerary(tourToEdit.itinerary || []);
    } else {
      // Defaults for new tour
      setTitle('');
      setSlug('');
      setIsSlugManuallyEdited(false);
      setDestination('');
      setCategory(CATEGORIES[0]);
      setDuration('5 Days / 4 Nights');
      setDurationDays(5);
      setGroupSize('Private / Couple / Family');
      setPrice(19999);
      setOriginalPrice(23999);
      setDiscountPercent(16);
      setHeroImage('https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85');
      setGallery([]);
      setOverview('');
      setTags('Heritage, Luxury, Culture');
      setTripType('Private Tour');
      setBestTime('Oct - Mar');
      setStartEnd('');
      setIsPublished(true);
      setFeatured(false);
      setBestSeller(false);
      setInclusions([
        'Curated 4-star boutique hotel stays',
        'Daily complimentary breakfast and traditional dinner',
        'Private chauffeur-driven AC vehicle for entire tour',
        'All monument entry tickets and sightseeing permits',
      ]);
      setExclusions([
        'Airfare / Train tickets to destination',
        'Personal expenses, shopping, and laundry',
        'Optional adventure activity fees',
      ]);
      setItinerary([
        {
          day: 1,
          title: 'Arrival & Welcome Dinner',
          description: 'Chauffeur pickup from the airport/station. Check into hotel and enjoy an evening orientation and welcome dinner.',
          meals: 'Welcome Dinner',
          accommodation: 'Curated Boutique Stay',
        },
      ]);
    }
    setActiveTab('basic');
  }, [tourToEdit, isOpen]);

  // Auto-generate slug when title changes (if not manually edited)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  // Recalculate discount percent when price or originalPrice changes
  const handlePriceChange = (newPrice: number, newOrigPrice?: number) => {
    setPrice(newPrice);
    const orig = newOrigPrice !== undefined ? newOrigPrice : originalPrice;
    if (orig && orig > newPrice) {
      setDiscountPercent(Math.round(((orig - newPrice) / orig) * 100));
    }
  };

  // Handle Cloudinary Hero Image Upload
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingHero(true);
      const token = await getToken();
      const res = await adminUploadImage(file, token);

      if (res.success && res.url) {
        setHeroImage(res.url);
        showToast('Hero image uploaded successfully to Cloudinary!', 'success');
      } else {
        showToast(res.error || 'Failed to upload image to Cloudinary.', 'error');
      }
    } catch (err) {
      showToast('Image upload failed: ' + (err as Error).message, 'error');
    } finally {
      setUploadingHero(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = '';
    }
  };

  // Handle Cloudinary Gallery Image Upload
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGallery(true);
      const token = await getToken();
      const res = await adminUploadImage(file, token);

      if (res.success && res.url) {
        setGallery((prev) => [...prev, res.url as string]);
        showToast('Image added to gallery!', 'success');
      } else {
        showToast(res.error || 'Failed to upload gallery image.', 'error');
      }
    } catch (err) {
      showToast('Upload failed: ' + (err as Error).message, 'error');
    } finally {
      setUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  // Add URL to gallery manually
  const handleAddGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setGallery((prev) => [...prev, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  // Remove gallery item
  const handleRemoveGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Inclusions handlers
  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions((prev) => [...prev, newInclusion.trim()]);
      setNewInclusion('');
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  // Exclusions handlers
  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      setExclusions((prev) => [...prev, newExclusion.trim()]);
      setNewExclusion('');
    }
  };

  const handleRemoveExclusion = (index: number) => {
    setExclusions((prev) => prev.filter((_, i) => i !== index));
  };

  // Itinerary handlers
  const handleAddDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary((prev) => [
      ...prev,
      {
        day: nextDay,
        title: `Day ${nextDay} Exploration`,
        description: '',
        meals: 'Breakfast & Dinner',
        accommodation: 'Selected Hotel / Resort',
      },
    ]);
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: string | number) => {
    setItinerary((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveDay = (index: number) => {
    setItinerary((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, day: idx + 1 }))
    );
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a tour title.', 'error');
      setActiveTab('basic');
      return;
    }

    if (!destination.trim()) {
      showToast('Please enter a destination.', 'error');
      setActiveTab('basic');
      return;
    }

    if (!heroImage.trim()) {
      showToast('Please provide a hero image (upload or URL).', 'error');
      setActiveTab('media');
      return;
    }

    if (!overview.trim()) {
      showToast('Please enter an overview description.', 'error');
      setActiveTab('details');
      return;
    }

    try {
      setSubmitting(true);
      const token = await getToken();

      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<TourPackage> = {
        title: title.trim(),
        slug: slug.trim(),
        destination: destination.trim(),
        category,
        duration: duration.trim(),
        durationDays: Number(durationDays),
        groupSize: groupSize.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discountPercent: discountPercent ? Number(discountPercent) : undefined,
        heroImage: heroImage.trim(),
        gallery,
        overview: overview.trim(),
        tags: parsedTags,
        tripType: tripType.trim(),
        bestTime: bestTime.trim(),
        startEnd: startEnd.trim(),
        isPublished,
        featured,
        bestSeller,
        inclusions,
        exclusions,
        itinerary,
      };

      const targetId = tourToEdit?.id || tourToEdit?._id;
      let res;
      if (tourToEdit && targetId) {
        res = await adminUpdateTour(targetId, payload, token);
      } else {
        res = await adminCreateTour(payload, token);
      }

      if (res.success) {
        showToast(
          tourToEdit ? 'Tour package updated successfully!' : 'Tour package created successfully!',
          'success'
        );
        onSuccess();
        onClose();
      } else {
        showToast(res.error || 'Failed to save tour package.', 'error');
      }
    } catch (err) {
      showToast('Error saving tour: ' + (err as Error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                {tourToEdit ? 'Edit Package' : 'New Package'}
              </span>
              <span className="text-xs text-slate-400 font-medium">CMS Tour Editor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 font-serif">
              {tourToEdit ? `Edit: ${tourToEdit.title}` : 'Create Tour Package'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-teal-600 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Basic Info & Pricing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-teal-600 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. Media & Cloudinary</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'itinerary'
                ? 'border-teal-600 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3. Day-by-Day Itinerary ({itinerary.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-teal-600 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Inclusions & Settings</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
          {/* TAB 1: BASIC INFO & PRICING */}
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-slate-700">Package Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan Royal Forts & Palaces"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rajasthan-royal-forts"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setSlug(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 font-mono bg-slate-50/50"
                  />
                  <p className="text-[11px] text-slate-400">Public URL: /tour-packages/{slug || '...'}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan, India"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Group Size</label>
                  <input
                    type="text"
                    placeholder="e.g. Private / Couple / Family"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Duration Text *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Days / 5 Nights"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Duration in Days (Numeric) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/60 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Pricing & Discounts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Selling Price (₹ / person) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-600 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Original Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Optional strikethrough"
                      value={originalPrice || ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        setOriginalPrice(val);
                        handlePriceChange(price, val);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 focus:outline-none focus:border-teal-600 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Discount %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Auto computed"
                      value={discountPercent || ''}
                      onChange={(e) => setDiscountPercent(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-emerald-700 font-bold focus:outline-none focus:border-teal-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Trip Highlights Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Trip Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Private Tour, Luxury, Group"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Best Time to Visit</label>
                  <input
                    type="text"
                    placeholder="e.g. Oct - Mar"
                    value={bestTime}
                    onChange={(e) => setBestTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Circuit Start - End</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur - Udaipur"
                    value={startEnd}
                    onChange={(e) => setStartEnd(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & CLOUDINARY UPLOADS */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Hero Image Section */}
              <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-teal-600" />
                      <span>Hero Cover Image *</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Primary high-resolution landscape photo for cards and package header.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    disabled={uploadingHero}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition disabled:opacity-50 shadow-2xs"
                  >
                    {uploadingHero ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingHero ? 'Uploading...' : 'Upload to Cloudinary'}</span>
                  </button>
                  <input
                    ref={heroFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHeroFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Hero Image URL (or upload above):</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                  />
                </div>

                {heroImage && (
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                    <Image
                      src={heroImage}
                      alt="Hero preview"
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                      Hero Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Images Section */}
              <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Tour Gallery ({gallery.length} images)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Additional photos displayed in the tour carousel and mosaic.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-2xs"
                  >
                    {uploadingGallery ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingGallery ? 'Uploading...' : 'Upload Photo'}</span>
                  </button>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Paste URL for gallery */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste an external image URL to add to gallery..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                {gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {gallery.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Gallery photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.2 rounded">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ITINERARY BUILDER */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Day-by-Day Journey Itinerary</h3>
                  <p className="text-[11px] text-slate-500">
                    Provide travellers with clear daily milestones, activities, meals, and accommodations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Day {itinerary.length + 1}</span>
                </button>
              </div>

              <div className="space-y-4">
                {itinerary.map((dayItem, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-800 text-white font-bold text-[11px] flex items-center justify-center">
                          {dayItem.day}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">Day {dayItem.day}</span>
                      </div>
                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 text-[11px]">Day Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Arrival in Jaipur • Royal Welcome"
                        value={dayItem.title}
                        onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 text-[11px]">Description of Activities</label>
                      <textarea
                        rows={2}
                        placeholder="Detail the daily activities, guided monuments, landscapes..."
                        value={dayItem.description}
                        onChange={(e) => handleUpdateDay(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-600 text-[11px]">Meals Included</label>
                        <input
                          type="text"
                          placeholder="e.g. Breakfast & Dinner"
                          value={dayItem.meals || ''}
                          onChange={(e) => handleUpdateDay(index, 'meals', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-600 text-[11px]">Stay / Accommodation</label>
                        <input
                          type="text"
                          placeholder="e.g. Trident Hotel Jaipur"
                          value={dayItem.accommodation || ''}
                          onChange={(e) => handleUpdateDay(index, 'accommodation', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OVERVIEW, INCLUSIONS & VISIBILITY */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Overview */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Tour Overview & Experience Narrative *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide an enticing paragraph describing the journey, cultural highlights, and atmosphere..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Heritage, Luxury, Palace, Mountains"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
                />
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inclusions */}
                <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/60 space-y-3">
                  <div className="font-bold text-emerald-900 flex items-center justify-between">
                    <span>What&apos;s Included ({inclusions.length})</span>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Daily gourmet breakfast"
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclusion())}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {inclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-emerald-100 text-[11px]"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInclusion(idx)}
                          className="text-slate-400 hover:text-red-600 shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200/60 space-y-3">
                  <div className="font-bold text-rose-900 flex items-center justify-between">
                    <span>What&apos;s Excluded ({exclusions.length})</span>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Flight tickets"
                      value={newExclusion}
                      onChange={(e) => setNewExclusion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclusion())}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddExclusion}
                      className="px-2.5 py-1.5 bg-rose-700 text-white rounded-xl font-bold hover:bg-rose-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {exclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-rose-100 text-[11px]"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExclusion(idx)}
                          className="text-slate-400 hover:text-red-600 shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Toggles & Visibility */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Publishing & Promotion Status</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">Publish Live</div>
                      <div className="text-[10px] text-slate-400">Visible on public catalog</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">Featured Journey</div>
                      <div className="text-[10px] text-slate-400">Pinned on homepage</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={bestSeller}
                      onChange={(e) => setBestSeller(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">Best Seller</div>
                      <div className="text-[10px] text-slate-400">Highlighted badge</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 bg-white sticky bottom-0">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>Step: {activeTab}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition flex items-center gap-2 disabled:opacity-50 shadow-md"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {submitting
                    ? 'Saving to MongoDB...'
                    : tourToEdit
                    ? 'Save Changes'
                    : 'Create Tour Package'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
