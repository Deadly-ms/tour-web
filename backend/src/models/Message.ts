import mongoose, { Schema, InferSchemaType } from "mongoose";

export const STATUSES = ["unread", "read", "replied", "archived"] as const;
export type MessageStatus = (typeof STATUSES)[number];

const replySchema = new Schema(
  {
    body: { type: String, required: true },
    sentBy: String,
    sentAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: STATUSES, default: "unread", index: true },
    replies: [replySchema],
    repliedAt: Date,
  },
  { timestamps: true }
);

export type IMessage = InferSchemaType<typeof messageSchema>;
export default mongoose.model("Message", messageSchema);