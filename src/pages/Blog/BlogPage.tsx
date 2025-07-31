import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Comment from '../../components/CommentSection'

interface BlogCard {
  _id: string;
  title: string;
  writer: string;
  text: string;
  image: string;
  author:string;
  userId: string;
}


const stripHTML = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BlogPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<BlogCard | null>(null);
  const [loading, setLoading] = useState(true);

  const deletePost = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`, {
        withCredentials: true,
      });
      toast.success("Post deleted successfully!");
      navigate('/blog');
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete the post.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
        setData(res.data);
        // console.log(res.data.author);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        toast.error("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const {user} = useAuth();
  const currentUserId = user?._id;

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!data) return <div className="text-center py-10 text-red-500">Blog not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img src={data.image} alt={data.title} className="w-full h-64 object-cover rounded-md mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{data.title}</h1>
      <p className="text-blue-700 font-semibold mb-4">By {data.writer}</p>
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {stripHTML(data.text)}
      </p>
      
      <Comment blogId={id} />

      {currentUserId === data.author && (
        <button
          onClick={deletePost}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Delete Post
        </button>
      )}
    </div>
  );
};

export default BlogPage;
