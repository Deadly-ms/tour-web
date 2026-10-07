import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// 👇 paste this part here (temporary test)
transporter.verify((err) => {
  if (err) console.error("❌ Mail login failed:", err.message);
  else console.log("✅ Gmail ready to send");
});

export const sendMail = (opts: SendMailOptions) =>
  transporter.sendMail({
    from: `"Track Your Trip" <${process.env.GMAIL_USER}>`,
    ...opts,
  });