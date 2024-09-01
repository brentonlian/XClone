// app/profile/[id]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./profile.module.css";

export default async function Profile({ params }: { params: { id: string } }) {
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
    return <div className={styles.error}>Profile not found</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1>{profileData.username}'s Profile</h1>
      <p>Email: {profileData.email}</p>
      <p>Bio: {profileData.bio || "No bio available"}</p>
      <p>Joined on: {new Date(profileData.created_at).toLocaleDateString()}</p>
      {/* Add more profile details as needed */}
    </div>
  );
}
