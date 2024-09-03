import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (profileError) {
    return <div>Profile not found</div>;
  }

  return <ProfileClient profileData={profileData} userId={user.id} />;
}
