import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateProfile, getProfile } from "../api/profile";
import { useAuth } from "../context/AuthContext";

interface ProfileForm {
  bio: string;
  skills: string;
  github: string;
  linkedin: string;
  avatar: string;
}

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProfileForm>({
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    avatar: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      getProfile(user._id)
        .then(res => {
          const data = res.data;
          setForm({
            bio: data.bio || "",
            skills: data.skills?.join(", ") || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            avatar: data.avatar || ""
          });
        })
        .catch(err => {
          console.log("No existing profile, creating new one");
        });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrUpdateProfile({
        ...form,
        skills: form.skills.split(",").map(skill => skill.trim())
      });
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

        <input
          type="text"
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Avatar Image URL"
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
