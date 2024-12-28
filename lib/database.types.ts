// Shared UUID type alias for clarity
type UUID = string;

export type Database = {
  public: {
    Tables: {
      likes: {
        Row: {
          created_at: string;
          id: number;
          tweet_id: UUID; 
          user_id: UUID;  
        };
        Insert: {
          created_at?: string;
          id?: number;
          tweet_id: UUID; 
          user_id: UUID;  
        };
        Update: {
          created_at?: string;
          id?: number;
          tweet_id?: UUID; 
          user_id?: UUID;  
        };
        Relationships: [
          {
            foreignKeyName: "likes_tweet_id_fkey";
            columns: ["tweet_id"];
            isOneToOne: false;
            referencedRelation: "tweets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          profile_pic_url: string;
          bio: string;
          id: UUID; 
          name: string;
          username: string;
          avatar_url: string;
        };
        Insert: {
          bio: string;
          id: UUID; 
          name: string;
          username: string;
          avatar_url: string;
        };
        Update: {
          bio?: string;
          id?: UUID; 
          name?: string;
          username?: string;
          avatar_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tweets: {
        Row: {
          created_at: string;
          id: UUID; 
          title: string;
          user_id: UUID; 
        };
        Insert: {
          created_at?: string;
          id?: UUID; 
          title: string;
          user_id: UUID; 
        };
        Update: {
          created_at?: string;
          id?: UUID; 
          title?: string;
          user_id?: UUID; 
        };
        Relationships: [
          {
            foreignKeyName: "tweets_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};