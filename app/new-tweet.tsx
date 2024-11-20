"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./styles.module.css";

export default function NewTweet() {
  const [newTweet, setNewTweet] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleAddTweet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      let imageUrl = null;

      // Upload image to Supabase if provided
      if (image) {
        const fileName = `${user.id}-${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("tweet-images")
          .upload(fileName, image);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          setIsLoading(false);
          return;
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from("tweet-images")
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;

        //console log
        console.log("Image URL:", imageUrl);
      }

      // Insert tweet into the `tweets` table
      const { error: insertError } = await supabase.from("tweets").insert({
        title: newTweet.trim() || null, // Optional text content
        image_url: imageUrl, // Optional image URL
        user_id: user.id, // User's ID
      });

      if (insertError) {
        console.error("Error inserting tweet:", insertError);
        setIsLoading(false);
        return;
      }

      // Clear input fields after successful submission
      setNewTweet("");
      setImage(null);
    } catch (error) {
      console.error("Unexpected error adding tweet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddTweet} className={styles.newTweetForm}>
      <textarea
        value={newTweet}
        onChange={(e) => setNewTweet(e.target.value)}
        placeholder="What's happening?"
        className={styles["input-highlight"]}
        rows={3}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className={styles.fileInput}
      />
      <button type="submit" className={styles.tweetButton} disabled={isLoading}>
        {isLoading ? "Tweeting..." : "Tweet"}
      </button>
    </form>
  );
}
