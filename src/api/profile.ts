import axios from "axios";


export interface ProfileFormData {
  bio: string;
  skills: string[]; // from comma-separated string
  github: string;
  linkedin: string;
  avatar: string;
}

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // adjust for prod
  withCredentials: true,
});

export const getProfile = (id: string) => API.get(`${import.meta.env.VITE_API_BASE_URL}/profile/${id}`);
export const createOrUpdateProfile = (data: ProfileFormData) => API.post(`${import.meta.env.VITE_API_BASE_URL}/profile`, data);
