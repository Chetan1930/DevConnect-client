import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticate: boolean;
  setIsAuthenticate: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
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
      navigate("/");
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data.message || 
                        getAuthErrorMessage(error.response.status);
        } else if (error.request) {
          errorMessage = "No response from server. Please check your connection.";
        }
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const register = async ({ username, email, password, role }: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        { username, email, password, role },
        { withCredentials: true }
      );

      const loginResult = await login(email, password);
      
      if (!loginResult.success) {
        return {
          success: false,
          error: "Account created but login failed. Please try logging in."
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data.message || 
                        error.response.data.error || 
                        getAuthErrorMessage(error.response.status);
          
          if (error.response.data.errors) {
            errorMessage = Object.values(error.response.data.errors)
              .map((err: any) => err.message)
              .join('. ');
          }
        } else if (error.request) {
          errorMessage = "No response from server. Please check your connection.";
        }
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticate(false);
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      const sessionUser: User = res.data.user;
      setUser(sessionUser);
      setIsAuthenticate(true);
    } catch (error) {
      console.log("No active session found");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticate(true);
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
    fetchUser();
  }, []);

  function getAuthErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return "Invalid request data. Please check your inputs.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 403:
        return "Unauthorized access. Please login again.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Email already registered. Please use a different email.";
      case 422:
        return "Validation failed. Please check your inputs.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  }

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