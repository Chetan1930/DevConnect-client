// src/components/CommentSection.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface Comment {
  _id: string;
  text: string;
  user: {
    username: string;
    _id:string;
  };
  createdAt: string;
}

interface Props {
  blogId: string;
}

const CommentSection: React.FC<Props> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  
  const {user} = useAuth();

  const currentUserId = user?._id;

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/${blogId}/comments`,
        { withCredentials: true }
      );
      // console.log(res.data);
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to load comments");
    }
  };

  const deleteComment = async (_id: string) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/blogs/${_id}/comments`,
      { withCredentials: true }
    );
    setComments((prev) => prev.filter((c) => c._id !== _id));
    toast.success("Comment deleted");
  } catch (error) {
    toast.error("Error deleting comment");
  }
};

  const submitComment = async () => {
    if (!commentText.trim()) return toast.error("Comment cannot be empty");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/${blogId}/comment`,
        { text: commentText },
        { withCredentials: true }
      );
      setComments([res.data, ...comments]);
      setCommentText("");
    } catch (err) {
      toast.error("Error posting comment");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      <div className="mb-4">
        <textarea
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={submitComment}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Post Comment
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border p-2 rounded shadow-sm">
              <p className="text-gray-800">{comment.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                - {comment.user?.username || "Anonymous"} |{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              {currentUserId === comment.user._id && (
                  <button
                    onClick={()=>deleteComment(comment._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
