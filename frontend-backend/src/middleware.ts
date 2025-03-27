import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// List of public routes that don't require authentication
const publicRoutes = ["/"]; // Add any other routes that should be publicly accessible

export default function middleware(req) {
  // Get the current path
  const { pathname } = req.nextUrl;

  // Allow access if the path is in the publicRoutes list
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Apply authentication middleware for other pages
  return withAuth(req, {
    pages: {
      signIn: "/api/auth/signin", // Redirect to sign-in page if not authenticated
    },
  });
}

// Apply middleware to all routes
export const config = {
  matcher: "/((?!_next|static|favicon.ico).*)", // Excludes Next.js assets
};
