"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import Comments from "./comments"; // Import Comments component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, setOptimisticTweets] = useState<TweetWithAuthor[]>(tweets);
  const [userId, setUserId] = useState<string | null>(null); // Store user ID
  const reversedOptimisticTweets = [...optimisticTweets].reverse();
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Fetch the user's ID
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null); // Set the user's ID
    }
    fetchUser();
  }, [supabase]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tweets" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  async function handleDelete(tweetId: string) {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
  
    try {
      // First, delete all comments referencing this tweet
      const { error: commentError } = await supabase.from("comments").delete().eq("tweet_id", tweetId);
      if (commentError) {
        console.error("Error deleting associated comments:", commentError);
        alert("Failed to delete the associated comments. Please try again.");
        return;
      }
  
      // Then, delete the tweet itself
      const { error: tweetError } = await supabase.from("tweets").delete().eq("id", tweetId);
      if (tweetError) {
        console.error("Error deleting tweet:", tweetError);
        alert("Failed to delete the tweet. Please try again.");
        return;
      }
  
      // Update the UI after successful deletion
      setOptimisticTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
    } catch (err) {
      console.error("Unexpected error during deletion:", err);
      alert("Unexpected error occurred. Please try again.");
    }
  }
  
  
  

  return reversedOptimisticTweets.map((tweet) => (
    <div key={tweet.id} className={styles["tweet-box"]}>
      {/* Delete Button */}
      {userId === tweet.author.id && (
        <button
          onClick={() => handleDelete(tweet.id)}
          className={styles["post-delete-button"]}
        >
          Delete
        </button>
      )}

      {/* Profile Picture with Link to Profile Page */}
      <div className={styles["tweet-header"]}>
        <Link href={`/profile/${tweet.author.id}`}>
          <img
            src={tweet.author.profile_pic_url || "/default-avatar.png"} // Fallback image
            alt={`${tweet.author.name}'s avatar`}
            className={styles["avatar"]}
          />
        </Link>
        <p>
          {tweet.author.name} ({tweet.author.username})
        </p>
      </div>

      {/* Tweet Content */}
      <p>{tweet.title}</p>

      {/* Render Image if image_url is present */}
      {tweet.image_url && (
        <div className={styles["tweet-image-container"]}>
          <img
            src={tweet.image_url}
            alt="Tweet image"
            className={styles["tweet-image"]}
          />
        </div>
      )}

      {/* Likes Component */}
      <Likes tweet={tweet} />

      {/* Comments Section */}
      <Comments tweetId={tweet.id} />
    </div>
  ));
}
