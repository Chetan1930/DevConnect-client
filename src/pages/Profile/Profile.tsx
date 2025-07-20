import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../../api/profile";

interface Profile {
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  avatar: string;
  userId: {
    username: string;
    email: string;
  };
}

const Profile = () => {
  const { id } = useParams(); // grabbing :id from URL
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProfile(id)
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (
            err.response &&
            err.response.status === 404 &&
            err.response.data?.createPrompt
          ) {
            navigate("profile/edit"); // redirect if profile not found
          } else {
            console.error("Error fetching profile:", err);
          }
        });
    }
  }, [id, navigate]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.userId.username}</h2>
            <p className="text-gray-600">{profile.userId.email}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/profile/${id}/profile/edit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Edit Profile
        </button>
      </div>

      <p className="mb-4">{profile.bio}</p>

      <div className="mb-4">
        <h3 className="font-medium">Skills:</h3>
        <div className="flex flex-wrap mt-2 gap-2">
          {profile.skills.map((skill, i) => (
            <span
              key={i}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <a
          href={profile.github}
          target="_blank"
          className="text-blue-600 underline"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          className="text-blue-600 underline"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default Profile;
