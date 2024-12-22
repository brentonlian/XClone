import { Database as DB } from "@/lib/database.types";

type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
type Profile = DB["public"]["Tables"]["profiles"]["Row"];

declare global {
  type Database = DB;

  type TweetWithAuthor = Tweet & {
    author: Profile;
    likes: number;
    user_has_liked_tweet: boolean;
    avatar_url: string;
    image_url: string;
  };

  type Profiles = Profile & {
    name: string; // Full name of the user
    username: string; // Username of the user
    bio: string; // Bio information for the profile
  };
}
