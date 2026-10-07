"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:5000/api

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  const input = "w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input name="name" required placeholder="Your name" className={input} />
      <input name="email" type="email" required placeholder="Email" className={input} />
      <input name="phone" placeholder="Phone (optional)" className={input} />
      <input name="subject" placeholder="Subject" className={input} />
      <textarea name="message" required minLength={10} rows={5} placeholder="How can we help?" className={input} />
      {/* honeypot: hidden from humans */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <button disabled={state === "sending"} className="px-8 py-3 bg-black text-white disabled:opacity-50">
        {state === "sending" ? "Sending..." : "Send Message"}
      </button>

      {state === "done" && <p className="text-green-600">Thanks! We'll get back to you soon.</p>}
      {state === "error" && <p className="text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}