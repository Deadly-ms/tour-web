import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";

// Lets us use req.adminId in controllers with proper typing
declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await clerkClient.users.getUser(userId);
    const role = (user.publicMetadata as { role?: string })?.role;
    if (role !== "admin" && role !== "staff") {
      return res.status(403).json({ message: "Admin or staff privileges required" });
    }

    req.adminId = userId;
    next();
  } catch (err) {
    next(err);
  }
};