import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  user: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      setUser(storedUserEmail);
    }
  }, []);

  const login = (email: string) => {
    localStorage.setItem('userEmail', email);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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
