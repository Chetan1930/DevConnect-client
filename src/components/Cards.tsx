import React, { useState } from "react";
import LikeButton from "./Like";
import CommentModal from "./Comment";
import { useEffect } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  likeCount: number;
  likedByUser: boolean;
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
  const [showComments, setShowComments] = useState(false);
  const [likecount,setLikeCount] = useState(0);

  useEffect(()=>{
    const fetchlikes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blogs/${blog._id}`, {
          withCredentials: true,
        });
        setLikeCount(res.data.likeCount || 0 );
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchlikes();
  },[])

  return (
    <>
      <div className="w-full sm:w-[48%] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] duration-300">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-5 flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-blue-700 font-semibold">✍️ {writer}</p>
          <p className="text-gray-700 text-sm line-clamp-3">{text}</p>

          <div className="flex items-center gap-3 mt-2">
            <LikeButton
              blogId={blog._id}
              initialLiked={blog.likedByUser}
              initialCount={likecount}
            />

            <button
              onClick={() => setShowComments(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              💬 Comments
            </button>
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

      {showComments && (
        <CommentModal
          blogId={blog._id}
          title={title}
          writer={writer}
          text={text}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
};     

export default Card;
