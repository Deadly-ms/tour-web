'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/components/ui/Toast';
import { DestinationItem } from '@/types';
import {
  adminCreateDestination,
  adminUpdateDestination,
} from '@/services/destination.service';
import { adminUploadImage } from '@/services/tour.service';
import {
  X,
  Upload,
  Loader2,
  Sparkles,
  MapPin,
  Tag,
  Link as LinkIcon,
  Hash,
} from 'lucide-react';

interface DestinationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destinationToEdit?: DestinationItem | null;
}

export function DestinationFormModal({
  isOpen,
  onClose,
  onSuccess,
  destinationToEdit,
}: DestinationFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <DestinationFormContent
          onClose={onClose}
          onSuccess={onSuccess}
          destinationToEdit={destinationToEdit}
        />
      </div>
    </div>
  );
}

function DestinationFormContent({
  onClose,
  onSuccess,
  destinationToEdit,
}: {
  onClose: () => void;
  onSuccess: () => void;
  destinationToEdit?: DestinationItem | null;
}) {
  const { getToken } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(destinationToEdit?.name || '');
  const [image, setImage] = useState(destinationToEdit?.image || '');
  const [tags, setTags] = useState(
    destinationToEdit?.tags ? destinationToEdit.tags.join(', ') : 'Heritage, Culture, Adventure'
  );
  const [href, setHref] = useState(destinationToEdit?.href || '');
  const [order, setOrder] = useState<number>(destinationToEdit?.order ?? 1);
  const [isActive, setIsActive] = useState<boolean>(
    destinationToEdit?.isActive !== undefined ? destinationToEdit.isActive : true
  );

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auto-generate default href if name changes and href wasn't manually customized
  const handleNameChange = (val: string) => {
    setName(val);
    if (!destinationToEdit && (!href || href.startsWith('/tour-packages?destination='))) {
      setHref(`/tour-packages?destination=${encodeURIComponent(val.trim())}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB limit', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const token = await getToken();
      const res = await adminUploadImage(file, token);
      if (res.success && res.url) {
        setImage(res.url);
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast(res.error || 'Image upload failed. You can paste a direct URL.', 'error');
      }
    } catch (err) {
      showToast('Upload error: ' + (err as Error).message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Destination name is required', 'error');
      return;
    }

    if (!image.trim()) {
      showToast('Cover image URL is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const destinationData = {
        name: name.trim(),
        image: image.trim(),
        tags: parsedTags,
        href: href.trim() || `/tour-packages?destination=${encodeURIComponent(name.trim())}`,
        order: Number(order) || 0,
        isActive,
      };

      if (destinationToEdit) {
        const id = destinationToEdit.id || destinationToEdit._id;
        const res = await adminUpdateDestination(id!, destinationData, token);
        if (res.success) {
          showToast(res.message || 'Destination updated successfully', 'success');
          onSuccess();
          onClose();
        } else {
          showToast(res.error || 'Failed to update destination', 'error');
        }
      } else {
        const res = await adminCreateDestination(destinationData, token);
        if (res.success) {
          showToast(res.message || 'Destination created successfully', 'success');
          onSuccess();
          onClose();
        } else {
          showToast(res.error || 'Failed to create destination', 'error');
        }
      }
    } catch (err) {
      showToast('Error saving destination: ' + (err as Error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {destinationToEdit ? 'Edit Destination' : 'Add Popular Destination'}
            </h2>
            <p className="text-xs text-slate-500">
              Featured on the homepage &ldquo;Popular Destinations&rdquo; grid
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="p-6 space-y-4 overflow-y-auto text-sm">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Destination Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Rajasthan, Kerala, Ladakh, Kashmir"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-xs font-medium"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Cover Image <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-xs font-medium"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {uploadingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload</span>
            </button>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <Image
                src={image}
                alt="Preview"
                fill
                sizes="(max-width: 600px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tags / Highlights <span className="text-slate-400 font-normal">(comma-separated)</span>
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Heritage, Culture, Desert"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-xs font-medium"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            These will display as small pills on the destination card.
          </p>
        </div>

        {/* Link / URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Link Destination Target
          </label>
          <div className="relative">
            <LinkIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="/tour-packages?destination=Rajasthan"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-xs font-medium"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Pre-filters the tour packages list when visitors click this destination card.
          </p>
        </div>

        {/* Order & Active Status */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Display Order
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-xs font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Lower numbers appear first.</p>
          </div>

          <div className="flex flex-col justify-center">
            <label className="text-xs font-semibold text-slate-700 mb-2">Visibility</label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs font-medium text-slate-700">
                Active (Show on Home)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{destinationToEdit ? 'Save Changes' : 'Create Destination'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
