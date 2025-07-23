import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !image || !text) {
      alert('Please fill all the fields!');
      return;
    }

    setIsUploading(true); // Start loading

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('text', text);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blog/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      alert('Blog published successfully!');
      navigate('/blog');
    } catch (err) {
      console.error(err);
      alert('Something went wrong while publishing the blog.');
    } finally {
      setIsUploading(false); // Reset loading state
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

      {/* Image Upload */}

      <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Choose Your Blog Photo
          </label>
          <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setImage(file);
        }}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />
        </div>
      

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
        disabled={isUploading}
        className={`bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200 ${
          isUploading
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Publish'}
      </button>
    </div>
  );
};

export default CreateBlog;
