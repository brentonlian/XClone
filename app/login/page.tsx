import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import AuthButtonClient from "../auth-button-client";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/`);
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <AuthButtonClient user={user} />
    </div>
  );
}
