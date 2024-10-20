"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerActionClient({ cookies });

export async function handleLogin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { id, user_metadata } = user;
    const { name, avatar_url, email } = user_metadata;

    console.log("GitHub Avatar URL:", avatar_url); // Debugging step

    // Use 'profile_pic_url' instead of 'avatar_url'
    await supabase.from("profiles").upsert({
      id,
      name: name || "Anonymous",
      profile_pic_url: avatar_url, // Correct column name
      username: email || "no-email",
    });
  }
}
