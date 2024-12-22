"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Likes({ tweet }: { tweet: TweetWithAuthor }) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // State to manage the optimistic updates for likes
  const [currentTweet, setCurrentTweet] = useState(tweet);

  const handleLikes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Optimistic update: toggle likes locally
      const updatedTweet = {
        ...currentTweet,
        likes: currentTweet.user_has_liked_tweet
          ? currentTweet.likes - 1
          : currentTweet.likes + 1,
        user_has_liked_tweet: !currentTweet.user_has_liked_tweet,
      };

      setCurrentTweet(updatedTweet);

      // Update likes in the database
      if (currentTweet.user_has_liked_tweet) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: currentTweet.id });
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: currentTweet.id });
      }

      // Refresh the page to sync server-side state (optional)
      router.refresh();
    }
  };

  return (
    <button onClick={handleLikes}>
      {currentTweet.likes} {currentTweet.user_has_liked_tweet ? "Unlike" : "Like"}
    </button>
  );
}
