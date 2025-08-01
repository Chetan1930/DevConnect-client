import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateProfile, getProfile } from "../../api/profile";
import { useAuth } from "../../context/AuthContext";

interface ProfileForm {
  bio: string;
  skills: string;
  github: string;
  linkedin: string;
  avatar: File | null;
}

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProfileForm>({
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      getProfile(user._id)
        .then((res) => {
          const data = res.data;
          setForm({
            bio: data.bio || "",
            skills: data.skills?.join(", ") || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            avatar: null,
          });
        })
        .catch((err) => {
          console.log("No existing profile:", err.message);
        });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("Image size should be less than 2MB");
        return;
      }
      setForm((prev) => ({ ...prev, avatar: file }));
      setError("");
    }
  };

  const validateLinks = () => {
    if (form.github && !form.github.startsWith("https://github.com/")) {
      setError("GitHub URL must be in format: https://github.com/username");
      return false;
    }
    if (form.linkedin && !form.linkedin.startsWith("https://linkedin.com/in/")) {
      setError("LinkedIn URL must be in format: https://linkedin.com/in/username");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateLinks()) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("bio", form.bio);
      formData.append("skills", form.skills);
      formData.append("github", form.github);
      formData.append("linkedin", form.linkedin);
      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      await createOrUpdateProfile(formData);
      navigate(`/profile/${user?._id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            About You
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            rows={5}
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <input
            id="skills"
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="JavaScript, React, Node.js (comma separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Profile
            <span className="ml-1 text-xs text-gray-500">(format: https://github.com/username)</span>
          </label>
          <input
            id="github"
            type="url"
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
            <span className="ml-1 text-xs text-gray-500">(format: https://linkedin.com/in/username)</span>
          </label>
          <input
            id="linkedin"
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourusername"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo
            <span className="ml-1 text-xs text-gray-500">(max 2MB)</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {form.avatar && (
              <span className="text-sm text-gray-600">{form.avatar.name}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;