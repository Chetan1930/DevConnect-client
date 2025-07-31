import React, { useEffect, useState } from 'react';
import Card from '../../components/Cards';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import axios from 'axios';

interface BlogCard {
  _id: string;
  title: string;
  writer: string;
  text: string;
  image: string;
}

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<BlogCard[]>([]);

  const stripHTML = (html: string): string => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/all`, {
          withCredentials: true,
        });
        setCardData(res.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">DevConnect Blog</h1>
        <button
          onClick={() => navigate('/create/blog')}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
        >
          <Plus className="mr-2 h-5 w-5" />
          Write Post
        </button>
      </div>

      <div className="flex flex-wrap justify-between gap-4">
        {cardData.map((card) => (
          <Card
            key={card._id}
            title={card.title}
            writer={card.writer}
            text={stripHTML(card.text)}
            image={card.image}
            blog={{
              _id: card._id
            }}
            onReadMore={() => navigate(`/BlogPage/${card._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
