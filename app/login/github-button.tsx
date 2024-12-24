"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function GitHubButton() {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white">
      <button
        onClick={handleSignIn}
        className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg shadow-lg transition duration-300"
      >
        <Image
          src="/github-mark-white.png"
          alt="GitHub logo"
          width={40}
          height={40}
        />
        <span className="ml-2 text-white font-semibold">Login with GitHub</span>
      </button>
    </div>
  );
}
