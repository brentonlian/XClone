"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error retrieving user:", error.message);
    return NextResponse.json({ error: "Failed to retrieve user" }, { status: 500 });
  }

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
