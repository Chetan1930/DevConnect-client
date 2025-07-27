import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface LikeButtonProps {
  blogId: string;
  initialLiked: boolean;
  initialCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  blogId,
  initialLiked,
  initialCount,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount ? initialCount : 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/${blogId}/like`,
        {},
        { withCredentials: true }
      );
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      toast.error("Error liking post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`text-sm px-3 py-1 rounded ${
        liked ? "bg-red-500 text-white" : "bg-gray-200"
      }`}
    >
      {liked ? `👍 ${likeCount}` : "Like"}  
    </button>
  );
};

export default LikeButton;
