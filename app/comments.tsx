// Comments.js
"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./styles.module.css";

export default function Comments({ tweetId }) {
  const [comments, setComments] = useState([]);
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
        setComments(data);
      }
    };

    fetchComments();
  }, [tweetId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (newComment.trim() === "") return;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ tweet_id: tweetId, content: newComment }])
      .select("*, author: profiles(username)");

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      console.log("Added comment:", data); // Debugging line
      setComments([...comments, ...data]);
      setNewComment("");
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
        <button type="submit" className={styles.commentButton}>Post</button>
      </form>
    </div>
  );
}
