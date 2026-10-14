'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/components/ui/Toast';
import { DestinationItem } from '@/types';
import {
  adminListDestinations,
  adminToggleActiveDestination,
  adminDeleteDestination,
  adminSeedDestinations,
} from '@/services/destination.service';
import { DestinationFormModal } from './DestinationFormModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  MapPin,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Hash,
} from 'lucide-react';

export default function DestinationsPanel() {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [destinationToEdit, setDestinationToEdit] = useState<DestinationItem | null>(null);

  // Delete State
  const [destinationToDelete, setDestinationToDelete] = useState<DestinationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toggling status state
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Refresh
  const [refreshKey, setRefreshKey] = useState(0);
  const reload = useCallback(() => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await adminListDestinations(token);
        if (isMounted) {
          if (res.success) {
            setDestinations(res.data);
          } else {
            showToast(res.error || 'Failed to load destinations', 'error');
          }
        }
      } catch (err) {
        if (isMounted) {
          showToast('Could not load destinations: ' + (err as Error).message, 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [getToken, showToast, refreshKey]);

  const handleToggleActive = async (item: DestinationItem) => {
    const id = item.id || item._id;
    if (!id) return;
    setTogglingId(id);
    try {
      const token = await getToken();
      const res = await adminToggleActiveDestination(id, !item.isActive, token);
      if (res.success) {
        setDestinations((prev) =>
          prev.map((d) =>
            (d.id === id || d._id === id) ? { ...d, isActive: res.isActive } : d
          )
        );
        showToast(res.message || 'Status updated', 'success');
      } else {
        showToast(res.error || 'Failed to toggle status', 'error');
      }
    } catch (err) {
      showToast('Error toggling status: ' + (err as Error).message, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!destinationToDelete) return;
    const id = destinationToDelete.id || destinationToDelete._id;
    if (!id) return;

    setDeleting(true);
    try {
      const token = await getToken();
      const res = await adminDeleteDestination(id, token);
      if (res.success) {
        setDestinations((prev) => prev.filter((d) => d.id !== id && d._id !== id));
        showToast(res.message || 'Destination deleted successfully', 'success');
        setDestinationToDelete(null);
      } else {
        showToast(res.error || 'Failed to delete destination', 'error');
      }
    } catch (err) {
      showToast('Error deleting: ' + (err as Error).message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        'This will reset your destinations to the 5 default destinations (Rajasthan, Kerala, Ladakh, Meghalaya, Goa). Continue?'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await adminSeedDestinations(token);
      if (res.success) {
        showToast(res.message || 'Default destinations restored', 'success');
        reload();
      } else {
        showToast(res.error || 'Failed to restore default destinations', 'error');
      }
    } catch (err) {
      showToast('Error resetting: ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = destinations.filter((d) => d.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            Popular Destinations ({destinations.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeCount} active destinations appearing on the homepage grid.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSeedDefaults}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
            title="Restore default 5 destinations"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={() => {
              setDestinationToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destination name or tags..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-medium"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <p className="text-xs font-medium">Loading destinations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <MapPin className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-800">No destinations found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search
              ? 'Try modifying your search term.'
              : 'Add your first popular destination to feature it on the homepage.'}
          </p>
          {!search && (
            <button
              onClick={() => {
                setDestinationToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Add Destination
            </button>
          )}
        </div>
      ) : (
        /* Destinations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const id = item.id || item._id;
            const isToggling = togglingId === id;

            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                {/* Image Header with order & status badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 px-2 py-0.5 rounded-md shadow-xs">
                      <Hash className="w-3 h-3 text-slate-500" />
                      Order {item.order ?? 0}
                    </span>

                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleActive(item)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition shadow-xs cursor-pointer ${
                        item.isActive
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-slate-700/80 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : item.isActive ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{item.isActive ? 'Active' : 'Hidden'}</span>
                    </button>
                  </div>

                  {/* Bottom Image Details */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm font-serif">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Filter Link */}
                    <div className="text-xs text-slate-500 flex items-center gap-1 truncate font-mono">
                      <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate" title={item.href || `/tour-packages?destination=${item.name}`}>
                        {item.href || `/tour-packages?destination=${item.name}`}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {item.isActive ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Show</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setDestinationToEdit(item);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Destination"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDestinationToDelete(item)}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Destination"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {destinationToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete &ldquo;{destinationToDelete.name}&rdquo;?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this destination? It will no longer appear in the homepage Popular Destinations grid.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDestinationToDelete(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition inline-flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <DestinationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={reload}
        destinationToEdit={destinationToEdit}
      />
    </div>
  );
}
