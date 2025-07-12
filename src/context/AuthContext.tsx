import axios from "axios";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define user type based on your backend response structure
interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
}

// Define context value type
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticate: boolean;
  setIsAuthenticate: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);
  const navigate = useNavigate();

  // const handle(e:Event)

  const login = async (email: string, password: string) => {
    console.log("hume revice hui h ye detaials: ");
    console.log("email is : ",email)
    console.log("password is : ",password);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setUser(res.data);
      setIsAuthenticate(true);
      localStorage.setItem("token", res.data.token); // optional if you use token
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async ({username, email, password}: RegisterInput) => {
    console.log("hume revice hui h ye detaials: ");
    console.log("username is : ",username)
    console.log("email is : ",email)
    console.log("password is : ",password);
    try {
      await axios.post("/api/auth/register", { username, email, password });
      await login(email, password); // await login to properly update state
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticate(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

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

