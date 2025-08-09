import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ["/admin/login"];
  const isPublicPath = publicPaths.includes(path);
  
  // Check if the path is an admin path
  const isAdminPath = path.startsWith("/admin");
  
  if (!isAdminPath) {
    // Not an admin path, no need to check authentication
    return NextResponse.next();
  }
  
  const isAuthenticated = !!req.auth?.user?.id;
  
  // If the path is public and the user is logged in, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  
  // If the path is not public and the user is not logged in, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"]
}; 