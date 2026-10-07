import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/requireAdmin";
import * as c from "../controllers/contactController";

const router = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 20 : 100,
  message: { message: "Too many messages sent. Please try again after 15 minutes." },
});

router.post("/contact", limiter, c.createMessage);

router.use("/admin/messages", requireAdmin);
router.get("/admin/messages", c.listMessages);
router.get("/admin/messages/:id", c.getMessage);
router.post("/admin/messages/:id/reply", c.replyToMessage);
router.patch("/admin/messages/:id/status", c.updateStatus);
router.delete("/admin/messages/:id", c.deleteMessage);

export default router;