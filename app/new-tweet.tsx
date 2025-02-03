"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles.module.css";

export default function NewTweet() {
  const [newTweet, setNewTweet] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState(""); // State for the image title
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

      if (image) {
        const uniqueFileName = `${user.id}-${Date.now()}-${uuidv4()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("tweet-images")
          .upload(uniqueFileName, image);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          setIsLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("tweet-images")
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase.from("tweets").insert({
        title: newTweet.trim() || null,
        image_url: imageUrl,
        user_id: user.id,
      });

      if (insertError) {
        console.error("Error inserting tweet:", insertError);
        setIsLoading(false);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Unexpected error adding tweet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection and set title
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageTitle(file.name); // Set image title to file name
    }
  };

  return (
    <form onSubmit={handleAddTweet} className={styles.newTweetForm}>
      <textarea
        value={newTweet}
        onChange={(e) => setNewTweet(e.target.value)}
        placeholder="What's happening?"
        className={styles["input-highlight"]}
        cols={50}
      />
      <p style={{ marginBottom: "10px" }}></p>
      <div className={styles.container}>
        <label htmlFor="fileInput" className={styles.fileInputLabel}>
          <img
            src="/uploadImg.png"
            alt="Upload"
            className={styles.fileIcon}
          />
          Image
        </label>
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.fileInput}
        style={{ display: "none" }} // Hides default file input button
      />

      {image && (
        <div className={styles.imageTitleContainer}>
          <p style={{ marginBottom: "20px" }}></p>
          <p>{imageTitle} uploaded</p>
        </div>
      )}
      <p style={{ marginBottom: "1px" }}></p>
      <div className={styles.tweetButtonContainer}>
        <button type="submit" className={styles.tweetButton} disabled={isLoading}>
          {isLoading ? "Tweeting..." : "Tweet"}
        </button>
      </div>
    </form>
  );
}
