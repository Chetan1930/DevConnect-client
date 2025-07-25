import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Comment {
  _id: string;
  user: {
    username: string;
  };
  text: string;
}

interface Blog {
  _id: string;
}

interface CardProps {
  title: string;
  writer: string;
  text: string;
  image: string;
  blog: Blog;
  onReadMore?: () => void;
}
const Card: React.FC<CardProps> = ({
  title,
  writer,
  text,
  image,
  blog,
  onReadMore,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = async () => {
    try {
      console.log(`ye chal LIKE wala function with id : ${blog._id}`)
      setLikeLoading(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/blogs/${blog._id}/like`);
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      toast.error("Error liking post");
    } finally {
      setLikeLoading(false);
    }
  };

  const submitComment = async () => {
    try {
      console.log(`ye chal comment wala function with id : ${blog._id}`)
      console.log("comment text :->",commentText);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/blogs/${blog._id}/comment`, {
        text: commentText,
      });
      setComments([res.data, ...comments]);
      setCommentText("");
    } catch (err) {
      toast.error("Error posting comment");
    }
  };

  return (
    <div className="w-full sm:w-[48%] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <p className="text-sm text-blue-700 font-semibold">✍️ {writer}</p>

        <p className="text-gray-700 text-sm line-clamp-3">{text}</p>

        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`text-sm px-3 py-1 rounded ${
            liked ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          {liked ? "Unlike" : "Like"} ({likeCount})
        </button>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border p-2 mt-3"
        />

        <button
          onClick={submitComment}
          disabled={!commentText.trim()}
          className="bg-blue-600 text-white px-3 py-1 rounded mt-2 disabled:opacity-50"
        >
          Post Comment
        </button>

        <div className="mt-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b py-2">
              <strong>{comment.user.username}</strong>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        {onReadMore && (
          <button
            onClick={onReadMore}
            className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            Read More →
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;