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
      <div onClick={handleSignIn} className="cursor-pointer">
        <Image
          src="/githubButton.png"
          alt="Login with GitHub"
          width={200} // Adjust width to match your custom button size
          height={60} // Adjust height to match your custom button size
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}