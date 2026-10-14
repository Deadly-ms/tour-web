'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/components/ui/Toast';
import { GalleryItem } from '@/types';
import {
  adminCreateGallery,
  adminUpdateGallery,
} from '@/services/gallery.service';
import { adminUploadImage } from '@/services/tour.service';
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit?: GalleryItem | null;
}

const COMMON_CATEGORIES = [
  'Desert',
  'Mountains',
  'Lakes',
  'Beaches',
  'Nature',
  'Adventure',
  'Heritage',
  'Culture',
  'Stays',
  'General',
];

interface GalleryFormModalContentProps {
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit?: GalleryItem | null;
}

function GalleryFormModalContent({
  onClose,
  onSuccess,
  itemToEdit,
}: GalleryFormModalContentProps) {
  const { getToken } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [caption, setCaption] = useState(itemToEdit?.caption || '');
  const [imageUrl, setImageUrl] = useState(itemToEdit?.imageUrl || '');
  const [category, setCategory] = useState(itemToEdit?.category || 'General');
  const [isPublished, setIsPublished] = useState(
    itemToEdit?.isPublished !== undefined ? itemToEdit.isPublished : true
  );
  const [displayOrder, setDisplayOrder] = useState(itemToEdit?.displayOrder ?? 0);

  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('url');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WEBP, etc.)', 'error');
      return;
    }

    try {
      setUploading(true);
      const token = await getToken();
      const res = await adminUploadImage(file, token);

      if (res.success && res.url) {
        setImageUrl(res.url);
        setPreviewError(false);
        showToast('Image uploaded successfully to Cloudinary', 'success');
      } else {
        showToast(
          res.error ||
            'Could not upload image. If Cloudinary is not configured, you can switch to "Paste Image URL" mode.',
          'error'
        );
      }
    } catch (err) {
      showToast('Error uploading image: ' + (err as Error).message, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Photo title is required', 'error');
      return;
    }

    if (!imageUrl.trim()) {
      showToast('Please provide an image URL or upload an image file', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const token = await getToken();

      const payload: Partial<GalleryItem> = {
        title: title.trim(),
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
        category: category.trim() || 'General',
        isPublished,
        displayOrder: Number(displayOrder) || 0,
      };

      const itemId = itemToEdit?.id || itemToEdit?._id;

      if (itemId) {
        const res = await adminUpdateGallery(itemId, payload, token);
        if (res.success) {
          showToast(res.message || 'Gallery photo updated successfully', 'success');
          onSuccess();
          onClose();
        } else {
          showToast(res.error || 'Failed to update photo', 'error');
        }
      } else {
        const res = await adminCreateGallery(payload, token);
        if (res.success) {
          showToast(res.message || 'Photo added to gallery', 'success');
          onSuccess();
          onClose();
        } else {
          showToast(res.error || 'Failed to add photo', 'error');
        }
      }
    } catch (err) {
      showToast('Error saving photo: ' + (err as Error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                {itemToEdit ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
              </h2>
              <p className="text-xs text-gray-500">
                {itemToEdit
                  ? 'Update image, captions, or display visibility'
                  : 'Add a new moment to Explore Gallery and Moments That Inspire'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Photo Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Golden Thar Dunes, Himalayan Stargazing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black bg-white transition"
              required
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Caption / Story
            </label>
            <textarea
              rows={2}
              value={caption || ''}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="A brief 1-2 sentence description of the location or experience..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black bg-white transition resize-none"
            />
          </div>

          {/* Image Input Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Image Source <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    imageInputMode === 'url'
                      ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> URL
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    imageInputMode === 'upload'
                      ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Upload File
                  </span>
                </button>
              </div>
            </div>

            {/* Hidden file input always available for upload trigger */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {imageInputMode === 'url' ? (
              <div key="image-mode-url">
                <input
                  key="gallery-image-url-input"
                  type="url"
                  value={imageUrl || ''}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewError(false);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black bg-white transition"
                />
              </div>
            ) : (
              <div key="image-mode-upload">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-gray-300 hover:border-black rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-black" />
                      <span className="text-xs font-medium text-gray-600">Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900">Click to choose image file</span>
                      <span className="text-[11px] text-gray-400">JPEG, PNG, WEBP up to 10MB</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="relative mt-2 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 h-44 sm:h-52 w-full flex items-center justify-center">
                {!previewError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400 p-4 text-center">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-xs text-gray-600 font-medium">Could not load image preview</span>
                    <span className="text-[11px] text-gray-400">Please verify the URL is a direct image link</span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                  Preview
                </span>
              </div>
            )}
          </div>

          {/* Category & Order Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Category
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={category || ''}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Desert, Mountains"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black bg-white transition"
                />
                <div className="flex flex-wrap gap-1">
                  {COMMON_CATEGORIES.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition ${
                        category === cat
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder ?? 0}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black bg-white transition"
              />
              <span className="text-[11px] text-gray-400 block mt-1">
                Lower numbers appear first (0, 1, 2...)
              </span>
            </div>
          </div>

          {/* Published Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-black focus:ring-black border-gray-300"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Publish to Live Site
                </span>
                <span className="text-[11px] text-gray-500 block">
                  When enabled, this photo is immediately visible in Explore Gallery and Moments That Inspire.
                </span>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{itemToEdit ? 'Update Photo' : 'Add Photo'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GalleryFormModal({
  isOpen,
  onClose,
  onSuccess,
  itemToEdit,
}: GalleryFormModalProps) {
  if (!isOpen) return null;

  return (
    <GalleryFormModalContent
      key={itemToEdit?.id || itemToEdit?._id || 'new'}
      onClose={onClose}
      onSuccess={onSuccess}
      itemToEdit={itemToEdit}
    />
  );
}
