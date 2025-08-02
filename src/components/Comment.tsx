import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

interface Comment {
  _id: string;
  user: {
    username: string;
    _id:string;
  };
  text: string;
}

interface CommentModalProps {
  blogId: string;
  title: string;
  writer: string;
  text: string;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  blogId,
  title,
  writer,
  text,
  onClose,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const {user} = useAuth();
  const currentUserId= user?._id;

  console.log(currentUserId);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/${blogId}/comments`,
        { withCredentials: true }
      );
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to load comments");
    }
  };

  const submitComment = async () => {
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


  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-2xl p-6 rounded-xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-red-600 text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">By {writer}</p>
        <p className="text-gray-800 mb-4">{text}</p>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border p-2 rounded"
        />
        <button
          onClick={submitComment}
          disabled={!commentText.trim()}
          className="bg-blue-600 text-white px-4 py-1 mt-2 rounded disabled:opacity-50"
        >
          Post Comment
        </button>

        <div className="mt-4 max-h-[40vh] overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-b py-2">
                <strong>{comment.user.username}</strong>
                <p>{comment.text}</p>

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
    </div>
  );
};

export default CommentModal;
