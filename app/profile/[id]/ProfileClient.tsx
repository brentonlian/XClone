// app/profile/[id]/ProfileClient.tsx
// Client side logic. Server side logic is in page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./profile.module.css";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProfileClient({
  profileData,
  userId,
}: {
  profileData: { id: string; username: string; bio: string };
  userId: string;
}) {
  const [bio, setBio] = useState(profileData.bio || "");
  const supabase = createClientComponentClient();

  // Handle bio update
  const handleBioChange = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("id", profileData.id);
  
    if (error) {
      console.error("Error updating bio:", error.message);
    } else {
      console.log("Bio updated successfully");
      window.location.reload();  // Force a reload to fetch updated data
    }
  };
  
  return (
    <div className={styles.profileContainer}>
      <h1>{profileData.username}'s Profile</h1>
      <p>Bio:</p>
      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className={styles.bioInput}
      />
      <button onClick={handleBioChange} className={styles.updateButton}>
        Update Bio
      </button>

      {/* If the current profile is not the user's own profile, show a link to the homepage */}
      {profileData.id !== userId && (
        <Link href={`/`} className={styles.myProfileLink}>
          Home
        </Link>
      )}
    </div>
  );
}
