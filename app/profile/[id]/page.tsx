// app/profile/[id]/page.tsx
// Contains server side logic
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import styles from "./profile.module.css";

export default async function Profile({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch the user
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch the profile data
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (profileError) {
    return <div className={styles.error}>Profile not found</div>;
  }

  // Pass the profile data and user ID to the Client Component
  return <ProfileClient profileData={profileData} userId={user.id} />;
}
