import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Tweets from "./tweets";
import Link from "next/link"; // Import Link component from Next.js
import styles from "./styles.module.css";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: user, error,
  } = await supabase.auth.getUser();

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
        (like) => like.user_id === user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  const ProfileButton = ({ authorId }: { authorId: string }) => (
    <Link href={`/profile/${authorId}`}>
      <a className={styles.profileButton}>View Profile</a>
    </Link>
  );

  return (
    <div className={styles.centeredContainer}>
      <AuthButtonServer />
      <NewTweet />
      <Tweets
        tweets={tweets} />
    </div>
  );
}
