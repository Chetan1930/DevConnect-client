import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface BlogCard {
  _id: string;
  title: string;
  writer: string;
  text: string;
  image: string;
}

const stripHTML = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BlogPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<BlogCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!data) return <div className="text-center py-10 text-red-500">Blog not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img src={data.image} alt={data.title} className="w-full h-64 object-cover rounded-md mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{data.title}</h1>
      <p className="text-blue-700 font-semibold mb-4">By {data.writer}</p>
      <p className="text-gray-700 text-lg leading-relaxed">
        {stripHTML(data.text)}
      </p>
    </div>
  );
};

export default BlogPage;
