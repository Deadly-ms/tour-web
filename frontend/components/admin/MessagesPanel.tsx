"use client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Send, ArrowLeft, Archive, Trash2, MailOpen } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type Reply = { body: string; sentAt: string };
type Trip = {
  tourSlug?: string; tourTitle?: string; destination?: string; duration?: string;
  travelers?: string; travelStyle?: string; travelDate?: string;
};
type Msg = {
  _id: string; name: string; email: string; phone?: string; subject?: string;
  message: string; status: "unread" | "read" | "replied" | "archived";
  type?: "contact" | "trip"; trip?: Trip;
  replies: Reply[]; createdAt: string;
};

const FILTERS = ["all", "unread", "read", "replied", "archived"] as const;
const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "trip", label: "Trip enquiries" },
  { value: "contact", label: "Contact" },
] as const;

const badge: Record<string, string> = {
  unread: "bg-red-50 text-red-700 border-red-200",
  read: "bg-gray-50 text-gray-600 border-gray-200",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-amber-50 text-amber-700 border-amber-200",
};

const initials = (n: string) =>
  n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const when = (d: string) => {
  const date = new Date(d);
  const today = new Date().toDateString() === date.toDateString();
  return today
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
};

export default function MessagesPanel({
  onUnreadChange,
}: {
  onUnreadChange?: (n: number) => void;
}) {
  const { getToken } = useAuth();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_FILTERS)[number]["value"]>("all");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [active, setActive] = useState<Msg | null>(null);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const api = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${API}/admin/messages${path}`, {
        ...init,
        headers,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
      return data;
    },
    [getToken]
  );

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await api(`?status=${filter}&type=${typeFilter}`);
      setMessages(data.messages || []);
      onUnreadChange?.(data.unread || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [api, filter, typeFilter, onUnreadChange]);

  // initial load + refresh every 30s so new messages appear
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return messages.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject || "").toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }, [messages, query]);

  async function open(id: string) {
    setActive(await api(`/${id}`)); // backend marks it as read
    setReply("");
    load();
  }

  async function send() {
    if (!active || !reply.trim()) return;
    setSending(true);
    setError("");
    try {
      setActive(await api(`/${active._id}/reply`, { method: "POST", body: JSON.stringify({ body: reply }) }));
      setReply("");
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function setStatus(status: string) {
    if (!active) return;
    setActive(await api(`/${active._id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }));
    load();
  }

  async function remove() {
    if (!active || !confirm("Delete this conversation permanently?")) return;
    await api(`/${active._id}`, { method: "DELETE" });
    setActive(null);
    load();
  }

  return (
    <div className="grid md:grid-cols-[360px_1fr] h-[640px] rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* ============ LEFT: conversation list ============ */}
      <aside className={`${active ? "hidden md:flex" : "flex"} flex-col border-r border-gray-200`}>
        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-teal-600"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full capitalize border ${
                  filter === f ? "bg-slate-900 text-white border-slate-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  typeFilter === t.value ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {visible.map((m) => (
            <li
              key={m._id}
              onClick={() => open(m._id)}
              className={`flex gap-3 p-4 cursor-pointer hover:bg-gray-50 ${active?._id === m._id ? "bg-teal-50/60" : ""}`}
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-sm font-semibold">
                {initials(m.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <span className={`truncate text-sm ${m.status === "unread" ? "font-bold" : "font-medium"}`}>{m.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{when(m.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {m.type === "trip" && (
                    <span className="mr-1.5 text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                      Trip
                    </span>
                  )}
                  {m.subject || "No subject"}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-sm truncate ${m.status === "unread" ? "text-gray-900" : "text-gray-500"}`}>{m.message}</p>
                  {m.status === "unread" ? (
                    <span className="ml-2 w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  ) : (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 border rounded shrink-0 ${badge[m.status]}`}>{m.status}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
          {loading && (
            <li className="p-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
              <span className="w-5 h-5 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
              <span>Loading messages...</span>
            </li>
          )}
          {!loading && error && (
            <li className="p-5 text-center text-xs text-red-600 bg-red-50/60 m-3 rounded-xl border border-red-200">
              <p className="font-semibold mb-1">Could not load messages</p>
              <p className="text-[11px] text-red-500 mb-2">{error}</p>
              <button
                onClick={load}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </li>
          )}
          {!loading && !error && visible.length === 0 && (
            <li className="p-8 text-center text-sm text-gray-400">No messages here</li>
          )}
        </ul>
      </aside>

      {/* ============ RIGHT: chat thread ============ */}
      <section className={`${active ? "flex" : "hidden md:flex"} flex-col min-w-0`}>
        {!active ? (
          <div className="flex-1 grid place-items-center text-gray-400">
            <div className="text-center">
              <MailOpen className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* header */}
            <header className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
              <button className="md:hidden" onClick={() => setActive(null)}><ArrowLeft className="w-5 h-5" /></button>
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 grid place-items-center font-semibold text-sm">
                {initials(active.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{active.name}</p>
                <p className="text-xs text-gray-500 truncate">{active.email}{active.phone && ` · ${active.phone}`}</p>
              </div>
              <select
                value={active.status}
                onChange={(e) => setStatus(e.target.value)}
                className={`text-xs border rounded-full px-3 py-1.5 capitalize ${badge[active.status]}`}
              >
                {["unread", "read", "replied", "archived"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button title="Archive" onClick={() => setStatus("archived")} className="p-2 rounded-full hover:bg-gray-100"><Archive className="w-4 h-4" /></button>
              <button title="Delete" onClick={remove} className="p-2 rounded-full hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </header>

            {/* bubbles */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/60">
              {active.subject && <p className="text-center text-xs text-gray-400">Subject: {active.subject}</p>}

              {active.type === "trip" && active.trip && (
                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 text-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 mb-2">Trip details</p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {([
                      ["Tour", active.trip.tourTitle],
                      ["Destination", active.trip.destination],
                      ["Duration", active.trip.duration],
                      ["Travelers", active.trip.travelers],
                      ["Style", active.trip.travelStyle],
                      ["Preferred date", active.trip.travelDate
                        ? new Date(active.trip.travelDate).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
                        : undefined],
                    ] as [string, string | undefined][])
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[11px] text-gray-500">{k}</dt>
                          <dd className="font-medium text-gray-900">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}

              <div className="max-w-[80%]">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm whitespace-pre-wrap">
                  {active.message}
                </div>
                <p className="text-[11px] text-gray-400 mt-1 ml-1">{new Date(active.createdAt).toLocaleString()}</p>
              </div>

              {active.replies.map((r, i) => (
                <div key={i} className="max-w-[80%] ml-auto">
                  <div className="bg-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm whitespace-pre-wrap">
                    {r.body}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 mr-1 text-right">
                    Emailed {new Date(r.sentAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* composer */}
            <footer className="p-4 border-t border-gray-100">
              {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
              <div className="flex gap-2 items-end">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send(); }}
                  rows={2}
                  placeholder={`Reply to ${active.name} by email... (Ctrl+Enter to send)`}
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                />
                <button
                  onClick={send}
                  disabled={sending || !reply.trim()}
                  className="h-11 px-5 rounded-xl bg-teal-600 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {sending ? "Sending" : "Send"}
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}