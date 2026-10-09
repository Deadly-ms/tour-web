"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { TourPackage } from "@/types";
import {
  adminListTours,
  adminTogglePublish,
  adminDeleteTour,
} from "@/services/tour.service";
import MessagesPanel from "@/components/admin/MessagesPanel";
import { TourFormModal } from "@/components/admin/TourFormModal";
import {
  Shield,
  ArrowLeft,
  Plus,
  Compass,
  Clock,
  Calendar,
  BarChart3,
  Search,
  Eye,
  Mail,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function AdminPage() {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState<"packages" | "messages">("packages");
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packageSearch, setPackageSearch] = useState("");
  const [unread, setUnread] = useState(0);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [tourToEdit, setTourToEdit] = useState<TourPackage | null>(null);

  // Delete Confirmation State
  const [tourToDelete, setTourToDelete] = useState<TourPackage | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle publish loading ID
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Fetch Tours from API
  const fetchTours = useCallback(async () => {
    try {
      setLoadingPackages(true);
      const token = await getToken();
      const res = await adminListTours(token);
      if (res.success) {
        setPackages(res.data);
      } else {
        showToast(res.error || "Failed to fetch tour packages", "error");
      }
    } catch (err) {
      console.error("Error loading tours:", err);
      showToast("Could not load tour packages", "error");
    } finally {
      setLoadingPackages(false);
    }
  }, [getToken, showToast]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Load initial unread message count from backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = await getToken();
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API}/admin/messages?status=unread`, {
          headers,
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setUnread(data.unread || 0);
        }
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [getToken]);

  // Handle Toggle Publish
  const handleTogglePublish = async (pkg: TourPackage) => {
    const id = pkg.id || pkg._id;
    if (!id) return;

    try {
      setTogglingId(id);
      const token = await getToken();
      const currentPublished = pkg.isPublished !== undefined ? pkg.isPublished : true;
      const res = await adminTogglePublish(id, !currentPublished, token);

      if (res.success) {
        setPackages((prev) =>
          prev.map((p) =>
            (p.id === id || p._id === id)
              ? { ...p, isPublished: res.isPublished }
              : p
          )
        );
        showToast(
          res.isPublished
            ? `"${pkg.title}" is now published and live!`
            : `"${pkg.title}" is now hidden as draft.`,
          "success"
        );
      } else {
        showToast(res.error || "Failed to update publish status", "error");
      }
    } catch (err) {
      showToast("Error updating publish status: " + (err as Error).message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Delete Tour
  const handleDeleteConfirm = async () => {
    if (!tourToDelete) return;
    const id = tourToDelete.id || tourToDelete._id;
    if (!id) return;

    try {
      setDeleting(true);
      const token = await getToken();
      const res = await adminDeleteTour(id, token);

      if (res.success) {
        setPackages((prev) => prev.filter((p) => p.id !== id && p._id !== id));
        showToast(res.message || "Tour package deleted successfully", "success");
        setTourToDelete(null);
      } else {
        showToast(res.error || "Failed to delete tour package", "error");
      }
    } catch (err) {
      showToast("Error deleting tour: " + (err as Error).message, "error");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.category.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(packageSearch.toLowerCase())
  );

  const publishedCount = packages.filter((p) => p.isPublished !== false).length;
  const publishedPercent =
    packages.length > 0 ? Math.round((publishedCount / packages.length) * 100) : 0;

  return (
    <div className="py-8 pb-24 space-y-10 min-h-screen bg-slate-50/50">
      <Container size="wide">
        <Breadcrumb items={[{ label: "Admin Console" }]} />

        {/* Header section */}
        <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                Staff / Admin Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 font-serif">
              Platform Administration
            </h1>
            <p className="mt-1 text-slate-600 text-sm">
              Manage live tour packages, reply to customer inquiries, and oversee departures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl transition shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </Link>
            <Button
              size="sm"
              onClick={() => {
                setTourToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="gap-1.5 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Package</span>
            </Button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Active Tour Packages
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-serif">
                {packages.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {publishedPercent}% Published
              </span>
            </div>
          </div>

          <div
            onClick={() => setTab("messages")}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 cursor-pointer hover:border-amber-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Pending Messages
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-serif">
                {unread}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  unread > 0
                    ? "text-red-700 bg-red-50"
                    : "text-emerald-700 bg-emerald-50"
                }`}
              >
                {unread > 0 ? "Requires Reply" : "All Caught Up"}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Confirmed Departures
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-serif">
                128
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                This Month
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Satisfaction Rating
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-serif">
                4.95 / 5
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                99.4% Positive
              </span>
            </div>
          </div>
        </div>

        {/* Tabs and Tab Content */}
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("packages")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  tab === "packages"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Tour Packages ({packages.length})
              </button>
              <button
                onClick={() => setTab("messages")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  tab === "messages"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Customer Messages</span>
                {unread > 0 && (
                  <span className="ml-1 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                    {unread}
                  </span>
                )}
              </button>
            </div>

            {tab === "packages" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter packages..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchTours}
                  disabled={loadingPackages}
                  title="Refresh Packages"
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loadingPackages ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Tour Packages */}
          {tab === "packages" && (
            <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {loadingPackages ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <p className="text-xs font-medium">Loading tour packages from MongoDB...</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-3">
                  <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="text-sm font-semibold text-slate-700">
                    {packageSearch ? "No packages match your search" : "No tour packages found"}
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {packageSearch
                      ? "Try searching for a different destination or category."
                      : "Get started by adding your first tour package to the platform."}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setTourToEdit(null);
                      setIsFormModalOpen(true);
                    }}
                    className="gap-1.5 text-xs font-bold mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Package</span>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Package</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredPackages.map((pkg) => {
                        const isLive = pkg.isPublished !== false;
                        const packageId = pkg.id || pkg._id || pkg.slug;
                        const isToggling = togglingId === packageId;

                        return (
                          <tr key={packageId} className="hover:bg-slate-50/60 transition group">
                            {/* Title & destination + thumbnail */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                                  {pkg.heroImage ? (
                                    <Image
                                      src={pkg.heroImage}
                                      alt={pkg.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <Compass className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 group-hover:text-teal-900 transition truncate max-w-xs sm:max-w-sm">
                                    {pkg.title}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate">
                                    {pkg.destination}
                                    {pkg.featured && (
                                      <span className="ml-2 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] whitespace-nowrap">
                                {pkg.category}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-medium whitespace-nowrap">{pkg.duration}</td>

                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                              ₹{pkg.price.toLocaleString("en-IN")}
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-bold text-amber-700">★ {pkg.rating}</span>
                              <span className="text-[10px] text-slate-400 ml-1">
                                ({pkg.reviewsCount})
                              </span>
                            </td>

                            {/* Publish Status Toggle */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <button
                                type="button"
                                disabled={isToggling}
                                onClick={() => handleTogglePublish(pkg)}
                                title={isLive ? "Click to unpublish" : "Click to publish"}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition border ${
                                  isLive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                }`}
                              >
                                {isToggling ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : isLive ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-amber-600" />
                                )}
                                <span>{isLive ? "Live (Published)" : "Draft (Hidden)"}</span>
                              </button>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                {/* Preview */}
                                <Link
                                  href={`/tour-packages/${pkg.slug}`}
                                  target="_blank"
                                  title="Preview Public Page"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>

                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTourToEdit(pkg);
                                    setIsFormModalOpen(true);
                                  }}
                                  title="Edit Tour Package"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-800 hover:bg-indigo-50 transition"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => setTourToDelete(pkg)}
                                  title="Delete Tour Package"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Messages / Messenger */}
          {tab === "messages" && (
            <div className="mt-6">
              <MessagesPanel onUnreadChange={setUnread} />
            </div>
          )}
        </div>
      </Container>

      {/* Tour Create / Edit Modal */}
      <TourFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTourToEdit(null);
        }}
        onSuccess={fetchTours}
        tourToEdit={tourToEdit}
      />

      {/* Delete Confirmation Modal */}
      {tourToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Tour Package?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-slate-800">&quot;{tourToDelete.title}&quot;</strong>?
                This action cannot be undone and will remove the package from the database.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setTourToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}