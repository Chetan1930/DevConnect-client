import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface LikeButtonProps {
  blogId: string;
  likeCount: number;
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  likedByUser: boolean;
  setLikedbyUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  blogId,
  likeCount,
  setLikeCount,
  likedByUser,
  setLikedbyUser,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/${blogId}/like`,
        {},
        { withCredentials: true }
      );
      setLikedbyUser(res.data.liked);
      setLikeCount(res.data.count);
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
        likedByUser ? "bg-red-500 text-white" : "bg-gray-200"
      }`}
    >
      {"👍"} {likeCount}
    </button>
  );
};

export default LikeButton;
