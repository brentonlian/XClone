"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; // Import User type

interface AuthButtonClientProps {
  user: User | null;
}

export default function AuthButtonClient({ user }: AuthButtonClientProps) {
  const supabase = createClientComponentClient();
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

  return user ? (
    <button onClick={handleSignOut}>
      Logout
    </button>
  ) : (
    <button onClick={handleSignIn}>
      Login
    </button>
  );
}
