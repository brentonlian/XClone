import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Tweets from "./tweets";
import Link from "next/link";
import styles from "./styles.module.css";
import { User } from '@supabase/supabase-js';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user }, error } = await supabase.auth.getUser();
  console.log(user);

  if (error || !user) {
    redirect("/login");
  }

  const { data: tweetData } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)");

  const tweets =
    tweetData?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === user?.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className={styles.centeredContainer}>
      <AuthButtonServer />
      <Link href={`/profile/${user?.id}`} className={styles.profileLink}>
        My Profile
      </Link>
      <NewTweet />
      <div className={styles.spacedContainer}>
      <Tweets tweets={tweets} />
      </div>
    </div>
  );
}
