import { Avatar } from "@mui/material";
import "../css/post.css";
import { Post as PostModel } from "../models/Post";
import { useState, useEffect, FormEvent } from "react";
import {
  Unsubscribe,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Comment } from "../models/Comment";
import { User } from "firebase/auth";

interface PostProps {
  post: PostModel;
  postId: string;
  user: User | null;
}

const Post = ({
  post: { caption, imageUrl, username },
  postId,
  user,
}: PostProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(5);

  const showMoreComments = () => {
    setVisibleComments(comments.length);
  };

  const displayedComments = comments.slice(0, visibleComments);

  const fetchCommentsForPost = (postId: string) => {
    const unsubscribe: Unsubscribe = onSnapshot(
      query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        try {
          const postComments = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Comment[];

          setComments(postComments);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      },
      (error) => {
        console.error("Error subscribing to posts:", error);
      }
    );

    return unsubscribe;
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    if (postId) {
      unsubscribe = fetchCommentsForPost(postId);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [postId]);

  const postComment = async (e: FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      timestamp: serverTimestamp(),
      comment,
      username: user?.displayName,
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username.toUpperCase()}
          src="https://avatars.githbusercontent.com/u/62655089?v=4"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="post image" />
      {caption && (
        <h4 className="post__text">
          <strong>@{username}</strong> {caption}
        </h4>
      )}

      {displayedComments.length > 0 && (
        <div className="post__comments">
          {displayedComments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.username}</strong> {comment.comment}{" "}
            </p>
          ))}

          {comments.length > visibleComments &&
            visibleComments < comments.length && (
              <button className="show__more" onClick={showMoreComments}>
                Load More
              </button>
            )}
        </div>
      )}

      {user && (
        <form className="post__commentBox" onSubmit={postComment}>
          <input
            type="text"
            className="post__input"
            placeholder="add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="post__button" disabled={!comment} type="submit">
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
