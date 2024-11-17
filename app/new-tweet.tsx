"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./styles.module.css";

export default function NewTweet() {
  const [newTweet, setNewTweet] = useState("");
  const [image, setImage] = useState<File | null>(null); // State to hold the image
  const supabase = createClientComponentClient();

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Set the selected image
    }
  };

  const handleAddTweet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newTweet.trim() === "") {
      console.error("Tweet cannot be empty");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    let imageUrl = "";

    // If there's an image, upload it to Supabase Storage
    if (image) {
      const { data, error } = await supabase.storage
        .from("tweet-images") // Make sure this is your bucket name
        .upload(`public/${image.name}`, image);

      if (error) {
        console.error("Error uploading image:", error);
        return;
      }

      // Generate the public URL of the uploaded image
      imageUrl = supabase.storage
        .from("tweet-images")
        .getPublicUrl(`public/${image.name}`).publicURL;
    }

    // Insert the tweet into the database, with or without an image URL
    await supabase.from("tweets").insert({
      title: newTweet,
      user_id: user.id,
      image_url: imageUrl, // Store the image URL in the database
    });

    setNewTweet(""); // Clear the input field after submission
    setImage(null); // Clear the selected image after submission
  };

  return (
    <form onSubmit={handleAddTweet}>
      <input
        type="text"
        value={newTweet}
        onChange={(e) => setNewTweet(e.target.value)}
        placeholder="What's happening?"
        className={styles["input-highlight"]}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.imageInput}
      />
      <button type="submit" className={styles.tweetButton}>
        Tweet
      </button>
    </form>
  );
}
