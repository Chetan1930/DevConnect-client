import { useState } from "react";
import { createOrUpdateProfile } from "../api/profile";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    avatar: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim())
    };

    try {
      await createOrUpdateProfile(payload);
      navigate("/dashboard"); // or profile page
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Your bio"
          className="w-full p-2 border rounded-md"
        />

        <input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full p-2 border rounded-md"
        />

        <input
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full p-2 border rounded-md"
        />

        <input
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="w-full p-2 border rounded-md"
        />

        <input
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="Avatar Image URL"
          className="w-full p-2 border rounded-md"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
