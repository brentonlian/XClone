import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"; // Import NextResponse for server-side redirect
import AuthButtonClient from "../auth-button-client";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is already logged in, redirect them to the home page
  if (session) {
    const origin = new URL(request.url).origin; // Get the base URL from the request
    return NextResponse.redirect(`${origin}/`); // Use the full URL for the redirect
  }

  return (
    <div className="flex-1 flex justify-center items-center">

      <AuthButtonClient session={session} />
    </div>
  );
}
