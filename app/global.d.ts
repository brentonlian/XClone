import { Database as DB } from "@/lib/database.types";

type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
type Profile = DB["public"]["Tables"]["profiles"]["Row"];

declare global {
  type Database = DB;

  type TweetWithAuthor = Tweet & {
    author: Profile; // Links a Profile object to the Tweet
    likes: number; // Count of likes for the tweet
    user_has_liked_tweet: boolean; // Whether the logged-in user has liked this tweet
    avatar_url: string; // URL for the author's avatar
    image_url?: string; // URL for an image associated with the tweet (optional)
  };

  type Profiles = Profile & {
    name: string; // Full name of the user
    username: string; // Username of the user
    bio: string; // Bio information for the profile
  };
}
