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
  name: string;
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
  logout: () => void;
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
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async ({ username, email, password, role }: RegisterInput) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        { username, email, password, role: role || "user" },
        { withCredentials: true }
      );
      await login(email, password); // wait for login to finish
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticate(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticate(true);
        navigate('/');
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
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
