"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import Comments from "./comments"; // Import Comments component
import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  const reversedOptimisticTweets = [...optimisticTweets].reverse();
  const supabase = createClientComponentClient();
  const router = useRouter();

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
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      
      {/* Comments Section */}
      <Comments tweetId={tweet.id} /> {/* Render Comments for each tweet */}
    </div>
  ));
}
