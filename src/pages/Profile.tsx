import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";// ye use hota h taki hum params se id le ske 
import { getProfile } from "../api/profile"; // ye huma bna rkha h vhi se import hua h bs

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
  const { id } = useParams(); // ye yha se aa gyi hmare paas id 
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (id) {
      getProfile(id).then(res => setProfile(res.data)).catch(err => console.error(err));
    }
  }, [id]);

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <div className="flex items-center space-x-4 mb-6">
        <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-xl font-semibold">{profile.userId.username}</h2>
          <p className="text-gray-600">{profile.userId.email}</p>
        </div>
      </div>

      <p className="mb-4">{profile.bio}</p>

      <div className="mb-4">
        <h3 className="font-medium">Skills:</h3>
        <div className="flex flex-wrap mt-2 gap-2">
          {profile.skills.map((skill, i) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <a href={profile.github} target="_blank" className="text-blue-600 underline">GitHub</a>
        <a href={profile.linkedin} target="_blank" className="text-blue-600 underline">LinkedIn</a>
      </div>
    </div>
  );
};

export default Profile;
