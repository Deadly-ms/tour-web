'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/components/ui/Toast';
import { GalleryItem } from '@/types';
import {
  adminListGallery,
  adminDeleteGallery,
  adminTogglePublishGallery,
  adminSeedGallery,
} from '@/services/gallery.service';
import { GalleryFormModal } from './GalleryFormModal';
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface GalleryPanelProps {
  onCountChange?: (count: number) => void;
}

export default function GalleryPanel({ onCountChange }: GalleryPanelProps) {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Fetch Gallery Items from backend
  const fetchGallery = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await adminListGallery(token);
      if (res.success) {
        setItems(res.data);
        onCountChange?.(res.total);
      } else {
        showToast(res.error || 'Failed to load gallery photos', 'error');
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      showToast('Could not load gallery photos', 'error');
    } finally {
      setLoading(false);
    }
  }, [getToken, onCountChange, showToast]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await adminListGallery(token);
        if (res.success && isMounted) {
          setItems(res.data);
          onCountChange?.(res.total);
        }
      } catch (err) {
        console.error('Error loading gallery on mount:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [getToken, onCountChange]);

  // Handle Toggle Publish
  const handleTogglePublish = async (item: GalleryItem) => {
    const id = item.id || item._id;
    if (!id) return;

    try {
      setTogglingId(id);
      const token = await getToken();
      const current = item.isPublished !== undefined ? item.isPublished : true;
      const res = await adminTogglePublishGallery(id, !current, token);

      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            (it.id === id || it._id === id)
              ? { ...it, isPublished: res.isPublished }
              : it
          )
        );
        showToast(
          res.isPublished
            ? `"${item.title}" is now published and live!`
            : `"${item.title}" is now hidden as draft.`,
          'success'
        );
      } else {
        showToast(res.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Error updating status: ' + (err as Error).message, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete.id || itemToDelete._id;
    if (!id) return;

    try {
      setDeleting(true);
      const token = await getToken();
      const res = await adminDeleteGallery(id, token);

      if (res.success) {
        setItems((prev) => prev.filter((it) => it.id !== id && it._id !== id));
        showToast(res.message || 'Photo deleted from gallery', 'success');
        setItemToDelete(null);
        onCountChange?.(items.length - 1);
      } else {
        showToast(res.error || 'Failed to delete photo', 'error');
      }
    } catch (err) {
      showToast('Error deleting photo: ' + (err as Error).message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Handle Re-seed Default Photos
  const handleSeedDefaults = async () => {
    if (!confirm('This will populate or restore default curated photos. Continue?')) {
      return;
    }

    try {
      setSeeding(true);
      const token = await getToken();
      const res = await adminSeedGallery(false, token);

      if (res.success) {
        showToast(res.message || 'Gallery seeded successfully', 'success');
        fetchGallery();
      } else {
        showToast(res.error || 'Failed to seed gallery', 'error');
      }
    } catch (err) {
      showToast('Error seeding: ' + (err as Error).message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Get unique categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.category) set.add(it.category);
    });
    return Array.from(set);
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(search.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'all' ||
        (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && item.isPublished !== false) ||
        (statusFilter === 'draft' && item.isPublished === false);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const publishedCount = items.filter((it) => it.isPublished !== false).length;
  const draftCount = items.length - publishedCount;

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Left: Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, caption, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-black bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | 'published' | 'draft')
              }
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
            >
              <option value="all">All Status ({items.length})</option>
              <option value="published">Live Only ({publishedCount})</option>
              <option value="draft">Drafts Only ({draftCount})</option>
            </select>

            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setLoading(true);
              fetchGallery();
            }}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Refresh gallery"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {items.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{seeding ? 'Seeding...' : 'Seed Default Photos'}</span>
            </button>
          )}

          <button
            onClick={() => {
              setItemToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Grid of Gallery Photos */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
          <p className="text-xs text-slate-500 font-medium">Loading gallery collection...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-bold text-slate-900">No gallery photos found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No items matched your current filter. Try resetting your search.'
                : 'Your gallery is currently empty. Add your first photo or populate default photos to display on the live site.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setItemToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Photo</span>
            </button>
            <button
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Populate Default 14 Photos</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => {
            const id = item.id || item._id;
            const isLive = item.isPublished !== false;

            return (
              <div
                key={id || index}
                className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs font-semibold">
                      #{item.displayOrder !== undefined ? item.displayOrder : index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      disabled={togglingId === id}
                      className={`pointer-events-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border transition shadow-xs cursor-pointer ${
                        isLive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={isLive ? 'Click to set as Draft' : 'Click to Publish'}
                    >
                      {togglingId === id ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : isLive ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-2.5 h-2.5 text-slate-400" />
                      )}
                      <span>{isLive ? 'Live' : 'Draft'}</span>
                    </button>
                  </div>

                  {/* Category Pill at bottom left of image */}
                  {item.category && (
                    <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs shadow-2xs">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </h4>
                    {item.caption ? (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-1">No caption provided</p>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        disabled={togglingId === id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                        title={isLive ? 'Hide from live site' : 'Publish to live site'}
                        aria-label="Toggle publish"
                      >
                        {isLive ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                      </button>

                      <button
                        onClick={() => {
                          setItemToEdit(item);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                        title="Edit photo"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete photo"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      <GalleryFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setItemToEdit(null);
        }}
        onSuccess={fetchGallery}
        itemToEdit={itemToEdit}
      />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Gallery Photo?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">&quot;{itemToDelete.title}&quot;</span>?
                This photo will be removed immediately from both Explore Gallery and Moments That Inspire.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
