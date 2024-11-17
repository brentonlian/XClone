import { Database as DB } from "@/lib/database.types";

type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
type Profile = DB["public"]["Tables"]["profiles"]["Row"];

declare global {
  type Database = DB;
  type TweetWithAuthor = Tweet & {
    author: Profile;
    likes: number;
    user_has_liked_tweet: boolean;
    avatar_url: string; // Assuming avatar_url is part of the Profile
    image_url: string | null; // Add image_url field for the tweet's image
  };
  
  type Profiles = Profile & {
    name: string;
    username: string;
    bio: string;
  };
}
