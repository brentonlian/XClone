import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();

  // If user is logged in, redirect them to the homepage
  if (session) {
    const origin = new URL(req.url).origin; // Get the base URL from the request
    return NextResponse.redirect(`${origin}/`); // Redirect to the homepage
  }

  return res; // Proceed with the request if not logged in
}

// Specify the URL pattern where the middleware should run
export const config = {
  matcher: '/login', // Only run on the login page
};
