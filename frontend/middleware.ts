import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

/**
 * Protects /admin for signed-in users with role "admin" or "staff".
 *
 * The role is read from the session token, so you must add this custom claim once in
 * Clerk Dashboard > Configure > Sessions > Customize session token:
 *   { "metadata": "{{user.public_metadata}}" }
 * Without it every user (including admins) is treated as having no role.
 *
 * The backend still checks the role on every /api/admin request (requireAdmin).
 */
const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== 'admin' && role !== 'staff') {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

// Without a Clerk key, auth is off. That is fine for local preview, but never in production:
// there the admin area is blocked instead of being left open.
const noClerkHandler = (req: NextRequest) => {
  if (process.env.NODE_ENV === 'production' && isAdminRoute(req)) {
    return new NextResponse('Admin area unavailable: authentication is not configured.', {
      status: 503,
    });
  }
  return NextResponse.next();
};

export default hasClerkKey ? clerkHandler : noClerkHandler;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset extensions
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};