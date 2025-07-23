import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateProfile, getProfile } from "../../api/profile";
import { useAuth } from "../../context/AuthContext";

interface ProfileForm {
  bio: string;
  skills: string;
  github: string;
  linkedin: string;
  avatar: File | null; // changed from string to File
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
            avatar: null, // don't prefill with URL
          });
        })
        .catch((err) => {
          console.log(
            "No existing profile, or error fetching it:",
            err.message
          );
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
    if (file) setForm((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", form.bio);
      formData.append("skills", form.skills);
      formData.append("github", form.github);
      formData.append("linkedin", form.linkedin);
      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      await createOrUpdateProfile(formData); // assume backend handles FormData

      navigate(`/profile/${user?._id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Your bio"
          className="w-full border rounded p-2"
          rows={4}
        />

        <input
          type="text"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="GitHub Profile URL"
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn Profile URL"
          className="w-full border rounded p-2"
        />

        {/* 📸 Image Upload */}
        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Choose Your Profile Photo
          </label>
          <input
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded transition duration-200 font-semibold shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
