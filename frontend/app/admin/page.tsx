"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { MOCK_TOUR_PACKAGES } from "@/lib/mock-data/tour-packages";
import MessagesPanel from "@/components/admin/MessagesPanel";
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
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function AdminPage() {
  const { getToken } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"packages" | "messages">("packages");
  const [packageSearch, setPackageSearch] = useState("");
  const [unread, setUnread] = useState(0);

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

  const filteredPackages = MOCK_TOUR_PACKAGES.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.category.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(packageSearch.toLowerCase())
  );

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
              onClick={() => showToast("Tour package creation form will open in CMS editor.", "info")}
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
                {MOCK_TOUR_PACKAGES.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                100% Published
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
                Tour Packages ({MOCK_TOUR_PACKAGES.length})
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
            )}
          </div>

          {/* Tab 1: Tour Packages */}
          {tab === "packages" && (
            <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
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
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{pkg.title}</div>
                          <div className="text-[11px] text-slate-500">{pkg.destination}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {pkg.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{pkg.duration}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-amber-700">★ {pkg.rating}</span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            ({pkg.reviewsCount})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/tour-packages/${pkg.slug}`}
                            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold px-2 py-1 rounded-md hover:bg-teal-50 transition"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </div>
  );
}