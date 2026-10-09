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
    const isDev = process.env.NODE_ENV !== "production";
    const authData = getAuth(req);
    const userId = authData?.userId;

    if (!userId) {
      if (isDev) {
        // In local development, allow admin access with warning so testing works smoothly
        req.adminId = "dev-admin-user";
        return next();
      }
      return res.status(401).json({ message: "Unauthorized. Please sign in as an administrator." });
    }

    try {
      const user = await clerkClient.users.getUser(userId);
      const role = (user.publicMetadata as { role?: string })?.role;
      const isConfiguredAdminEmail = user.emailAddresses?.some(
        (e) =>
          e.emailAddress === process.env.ADMIN_NOTIFY_EMAIL ||
          e.emailAddress === process.env.GMAIL_USER
      );

      if (role !== "admin" && role !== "staff" && !isConfiguredAdminEmail) {
        if (isDev) {
          req.adminId = userId;
          return next();
        }
        return res.status(403).json({ message: "Admin or staff privileges required" });
      }

      req.adminId = userId;
      return next();
    } catch (userFetchErr) {
      if (isDev) {
        req.adminId = userId || "dev-admin-user";
        return next();
      }
      throw userFetchErr;
    }
  } catch (err) {
    next(err);
  }
};