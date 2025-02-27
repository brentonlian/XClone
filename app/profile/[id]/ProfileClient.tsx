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
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const supabase = createClientComponentClient();

  // Handle bio update
  const handleBioChange = async () => {
    if (!profileData?.id) {
      console.error("Profile ID is undefined. Cannot update bio.");
      return;
    }

    setIsUpdating(true);
    setUpdateMessage(""); // Clear any previous messages

    const { data, error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("id", profileData.id)
      .select();

    if (error) {
      setUpdateMessage("Error updating bio. Please try again.");
      console.error("Error updating bio:", error.message);
    } else if (data && data.length > 0) {
      setBio(data[0].bio);
      setUpdateMessage("Bio updated successfully.");
    } else {
      setUpdateMessage("No data returned from the update.");
    }

    setIsUpdating(false);
  };

  return (
    <div className={styles.profileContainer}>
      <h1>{profileData.username}&apos;s Profile</h1>
      <label htmlFor="bioInput" className={styles.bioLabel}>
        Bio:
      </label>
      <input
        id="bioInput"
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className={styles.bioInput}
        placeholder="Enter your bio"
      />
      <button onClick={handleBioChange} className={styles.updateButton} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Bio"}
      </button>

      
      <Link href={`/`} className={styles.myProfileLink}>
        Return Home
      </Link>

      {updateMessage && (
        <div className={styles.popup}>
          <p>{updateMessage}</p>
        </div>
      )}
    </div>
  );
}
