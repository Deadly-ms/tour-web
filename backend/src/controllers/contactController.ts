import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import Message, { STATUSES } from "../models/Message";
import { sendMail } from "../utils/mailer";

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next: NextFunction) =>
    fn(req, res).catch(next);

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().max(150).optional().or(z.literal("")),
  message: z.string().min(10).max(3000),
  website: z.string().optional(), // honeypot
});

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  destination: z.string().trim().min(1).max(100),
  tourSlug: z.string().trim().max(120).optional().or(z.literal("")),
  tourTitle: z.string().trim().max(150).optional().or(z.literal("")),
  duration: z.string().trim().max(60).optional().or(z.literal("")),
  travelers: z.string().trim().max(60).optional().or(z.literal("")),
  travelStyle: z.string().trim().max(60).optional().or(z.literal("")),
  travelDate: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().optional(), // honeypot
});

const esc = (s: string = "") =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

// PUBLIC
export const createMessage = wrap(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues?.[0]?.message || "Please check your details.";
    return res.status(400).json({ message: errorMsg });
  }

  const { website, ...data } = parsed.data;
  if (website) return res.json({ success: true }); // bot: pretend success

  const doc = await Message.create(data);

  if (process.env.ADMIN_NOTIFY_EMAIL) {
    sendMail({
      to: process.env.ADMIN_NOTIFY_EMAIL,
      replyTo: doc.email,
      subject: `New enquiry: ${esc(doc.subject ?? "") || "No subject"}`,
      html: `<h3>New contact message</h3>
        <p><b>Name:</b> ${esc(doc.name)}<br/>
        <b>Email:</b> ${esc(doc.email)}<br/>
        <b>Phone:</b> ${esc(doc.phone ?? "") || "-"}</p>
        <p>${esc(doc.message).replace(/\n/g, "<br/>")}</p>`,
    }).catch((e) => console.error("Admin notify failed:", e.message));
  }

  res.status(201).json({ success: true });
});

// PUBLIC - "Plan Your Journey" / tour enquiry
export const createEnquiry = wrap(async (req, res) => {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues?.[0]?.message || "Please check your details.";
    return res.status(400).json({ message: errorMsg });
  }

  const { website, notes, name, email, phone, ...trip } = parsed.data;
  if (website) return res.json({ success: true }); // bot: pretend success

  const label = trip.tourTitle || trip.destination;
  const doc = await Message.create({
    name,
    email,
    phone,
    type: "trip",
    subject: `Trip enquiry: ${label}`,
    message: notes || "No additional notes. See trip details.",
    trip,
  });

  if (process.env.ADMIN_NOTIFY_EMAIL) {
    const row = (k: string, v?: string | null) =>
      v ? `<b>${k}:</b> ${esc(v)}<br/>` : "";
    sendMail({
      to: process.env.ADMIN_NOTIFY_EMAIL,
      replyTo: doc.email,
      subject: `New trip enquiry: ${label}`,
      html: `<h3>New trip enquiry</h3>
        <p>${row("Name", doc.name)}${row("Email", doc.email)}${row("Phone", doc.phone)}</p>
        <p>${row("Tour", trip.tourTitle)}${row("Destination", trip.destination)}${row("Duration", trip.duration)}${row("Travelers", trip.travelers)}${row("Style", trip.travelStyle)}${row("Preferred date", trip.travelDate)}</p>
        <p>${esc(notes ?? "").replace(/\n/g, "<br/>") || "<i>No additional notes</i>"}</p>`,
    }).catch((e) => console.error("Admin notify failed:", e.message));
  }

  res.status(201).json({ success: true });
});

// ADMIN
export const listMessages = wrap(async (req, res) => {
  const status = req.query.status;
  const type = req.query.type;
  const filter: Record<string, unknown> = {};
  if (typeof status === "string" && (STATUSES as readonly string[]).includes(status)) {
    filter.status = status;
  }
  // older messages have no "type" field, so "contact" means "anything that isn't a trip"
  if (type === "trip") filter.type = "trip";
  else if (type === "contact") filter.type = { $ne: "trip" };
  const [messages, unread] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).limit(200),
    Message.countDocuments({ status: "unread" }),
  ]);
  res.json({ messages, unread });
});

export const getMessage = wrap(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ message: "Not found" });
  if (msg.status === "unread") {
    msg.status = "read";
    await msg.save();
  }
  res.json(msg);
});

export const replyToMessage = wrap(async (req, res) => {
  const body = String(req.body.body ?? "").trim();
  if (!body) return res.status(400).json({ message: "Reply cannot be empty" });

  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ message: "Not found" });

  const sentDate = (msg as any).createdAt
    ? new Date((msg as any).createdAt).toDateString()
    : new Date().toDateString();

  await sendMail({
    to: msg.email,
    subject: `Re: ${msg.subject || "Your enquiry"}`,
    text: `${body}\n\n---\nOn ${sentDate} you wrote:\n${msg.message}`,
  });

  msg.replies.push({ body, sentBy: req.adminId, sentAt: new Date() });
  msg.status = "replied";
  msg.repliedAt = new Date();
  await msg.save();
  res.json(msg);
});

export const updateStatus = wrap(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status))
    return res.status(400).json({ message: "Invalid status" });
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(msg);
});

export const deleteMessage = wrap(async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});