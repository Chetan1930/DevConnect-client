import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !image || !text) {
      alert('Please fill all the fields!');
      return;
    }

    const payload = {
      title,
      image,
      text,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/create`, payload, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
      alert('Blog published successfully!'); 
      navigate('/blog')
    } catch (err) {
      console.error(err);
      alert('Something went wrong while publishing the blog.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">📝 Create New Blog</h1>

      {/* Blog Title */}
      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />

      {/* Image URL */}
      <input
        type="text"
        placeholder="Enter image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />

      {/* TinyMCE Text Editor */}
      <Editor
        apiKey={import.meta.env.VITE_API_TINY_API_KEY}
        value={text}
        onEditorChange={(content) => setText(content)}
        init={{
          height: 300,
          menubar: false,
          plugins: 'link image code lists preview',
          toolbar:
            'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code preview',
        }}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
      >
        Publish
      </button>
    </div>
  );
};

export default CreateBlog;
