import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from "./styles.module.css";

export default function NewTweet() {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
    }
  };

  return (
    <form action={addTweet}>
      <input name="title" className={styles["input-highlight"]} />
      <button type="submit" className={styles.tweetButton}>
        tweet
      </button>
    </form>
  );
}
