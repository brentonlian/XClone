"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs"; // Import Session type

// Add type for props to accept session
interface AuthButtonClientProps {
  session: Session | null;
}

export default function AuthButtonClient({ session }: AuthButtonClientProps) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return session ? (
    <button className="text-xs text-black-1000" onClick={handleSignOut}>
      Logout
    </button>
  ) : (
    <button className="text-xs text-black-1000" onClick={handleSignIn}>
      Login
    </button>
  );
}
