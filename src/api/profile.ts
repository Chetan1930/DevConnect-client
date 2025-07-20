import axios from "axios";

export interface ProfileFormData {
  bio: string;
  skills: string[]; // array of skills from comma-separated input
  github: string;
  linkedin: string;
  avatar: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getProfile = (id: string) => API.get(`/profile/${id}`);
export const createOrUpdateProfile = (data: ProfileFormData) =>
  API.post("/profile", data);
