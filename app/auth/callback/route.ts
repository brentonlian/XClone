"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Shared function to handle authentication callback logic
async function handleAuthCallback(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Retrieve the authorization code from the URL's query parameters
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    console.error("No authorization code provided in callback URL");
    return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
  }

  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code for session:", error.message);
    return NextResponse.json({ error: "Failed to exchange code for session" }, { status: 500 });
  }

  const user = data?.user;
  if (user) {
    const { id, user_metadata = {} } = user;
    const { name, avatar_url, email } = user_metadata;

    console.log("GitHub Avatar URL:", avatar_url);

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id,
      name: name || "Anonymous",
      profile_pic_url: avatar_url || "", // Default empty string if null
      username: email || "no-email",
    });

    if (upsertError) {
      console.error("Error updating profile:", upsertError.message);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  }

  return NextResponse.json({ error: "No user found" }, { status: 404 });
}

// Allow both GET and POST methods to handle the callback
export async function GET(request: Request) {
  return await handleAuthCallback(request);
}

export async function POST(request: Request) {
  return await handleAuthCallback(request);
}
