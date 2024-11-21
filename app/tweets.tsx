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

    const { error } = await supabase.from("tweets").delete().eq("id", tweetId);

    if (error) {
      console.error("Error deleting tweet:", error.message);
      return;
    }

    // Remove deleted tweet from optimisticTweets
    setOptimisticTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
  }

  return reversedOptimisticTweets.map((tweet) => (
    <div key={tweet.id} className={styles["tweet-box"]}>
      {/* Profile Picture with Link to Profile Page */}
      <div className={styles["tweet-header"]}>
        <Link href={`/profile/${tweet.author.id}`}>
          <img
            src={tweet.author.profile_pic_url || "/default-avatar.png"}
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

      {/* Delete Button */}
      {userId === tweet.author.id && (
        <button
          onClick={() => handleDelete(tweet.id)}
          className={`${styles["delete-button"]} bg-red-500 text-white px-4 py-2 rounded`}
        >
          Delete
        </button>
      )}
    </div>
  ));
}
