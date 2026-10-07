"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import MessagesPanel from "@/components/admin/MessagesPanel";
import { ArrowLeft, Shield } from "lucide-react";

export default function AdminMessagesPage() {
  return (
    <div className="py-8 pb-24 space-y-6 min-h-screen bg-slate-50/50">
      <Container size="wide">
        <Breadcrumb
          items={[
            { label: "Admin Console", href: "/admin" },
            { label: "Messenger" },
          ]}
        />

        <div className="mt-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                Staff / Admin Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 font-serif">
              Customer Messenger & Inquiries
            </h1>
            <p className="mt-1 text-slate-600 text-sm">
              Communicate directly with travelers, send email replies, and organize customer conversations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl transition shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
        </div>

        <MessagesPanel />
      </Container>
    </div>
  );
}