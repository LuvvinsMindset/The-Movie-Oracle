import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface UserContextType {
  user: string | null;
  username: string | null;
  role: string | null;
  login: (email: string, username: string) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  username: null,
  role: null,
  login: async () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser) {
      setUser(storedUser);
      setUsername(storedUsername);
      setRole(storedRole);

      fetchAndUpdateRole(storedUser);
    }
  }, []);

  const fetchAndUpdateRole = async (email: string) => {
    try {
      const response = await axios.get(`/api/user/role?email=${email}`);
      const dbRole = response.data.role;
      if (dbRole) {
        localStorage.setItem('userRole', dbRole);
        setRole(dbRole);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const login = async (email: string, username: string) => {
    try {
      const response = await axios.get(`/api/user/role?email=${email}`);
      const userRole = response.data.role;
      
    localStorage.setItem('userEmail', email);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', userRole);
      
    setUser(email);
      setUsername(username);
      setRole(userRole);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setUser(null);
    setUsername(null);
    setRole(null);
  };

  return (
    <UserContext.Provider value={{ user, username, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
