"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./styles.module.css";

export default function NewTweet() {
  const [newTweet, setNewTweet] = useState("");
  const supabase = createClientComponentClient();

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

    await supabase.from("tweets").insert({ title: newTweet, user_id: user.id });
    setNewTweet(""); // Clear the input field after submission
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
      <button type="submit" className={styles.tweetButton}>
        tweet
      </button>
    </form>
  );
}
