import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

// User interface
interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

// Context value type
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticate: boolean;
  setIsAuthenticate: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

// Register input type
interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ Setup global axios config (optional)
  axios.defaults.withCredentials = true;

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const loggedInUser: User = res.data.user;
      setUser(loggedInUser);
      setIsAuthenticate(true);
      localStorage.setItem("user",JSON.stringify(loggedInUser));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async ({ username, email, password, role }: RegisterInput) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        { username, email, password, role },
        { withCredentials: true }
      );
      await login(email, password); // auto login after register
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    setIsAuthenticate(false);
    navigate("/login");
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      const sessionUser: User = res.data.user;
      setUser(sessionUser);
      setIsAuthenticate(true);
      navigate('/');
    } catch (error) {
      console.log("No active session found");
    }
  };

  useEffect(() => {
    const extractUser = localStorage.getItem("user");
    if(extractUser){
      setUser(JSON.parse(extractUser));
    }
    fetchUser(); // check session on first load
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticate,
        setIsAuthenticate,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
