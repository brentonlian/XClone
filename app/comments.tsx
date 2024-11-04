// Comments.tsx
"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./styles.module.css";

type Comment = {
  id: number;
  content: string;
  tweet_id: number;
  author_id: string;
  author: {
    username: string;
  } | null;
};

export default function Comments({ tweetId }: { tweetId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Fetch comments for the tweet
    const fetchComments = async () => {
      console.log("Fetching comments for tweet ID:", tweetId); // Log tweetId

      const { data, error } = await supabase
        .from("comments")
        .select("*, author: profiles(username)")
        .eq("tweet_id", tweetId);

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        console.log("Fetched comments:", data); // Log fetched data
        setComments(data as Comment[]);
      }
    };

    fetchComments();
  }, [tweetId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submit button clicked"); // Debugging line

    if (newComment.trim() === "") {
      console.log("Comment is empty, aborting submission"); // Debugging line
      return;
    }

    // Retrieve the current user's ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated");
      return;
    }

    console.log("User authenticated, proceeding with comment insertion"); // Debugging line

    // Insert the comment with the author_id
    const { data, error } = await supabase
      .from("comments")
      .insert([{ tweet_id: tweetId, content: newComment, author_id: user.id }]) // Use author_id
      .select("*, author: profiles(username)");

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      console.log("Added comment successfully:", data); // Debugging line
      setComments([...comments, ...(data as Comment[])]);
      setNewComment(""); // Clear input field
    }
  };

  return (
    <div className={styles.commentsContainer}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <strong>{comment.author?.username}:</strong> {comment.content}
        </div>
      ))}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className={styles.commentInput}
        />
        <button type="submit" className={styles.commentButton}>
          Post
        </button>
      </form>
    </div>
  );
}
