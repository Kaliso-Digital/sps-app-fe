// PermissionsContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Permission = {
  id: number;
  name: string;
};

type PermissionsContextType = {
  userPermissions: Permission[];
  setPermissions: (permissions: Permission[]) => void;
  clearPermissions: () => void;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

type PermissionsProviderProps = {
  children: ReactNode;
};

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  const setPermissions = (permissions: Permission[]) => {
    setUserPermissions(permissions);
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
  };

  const clearPermissions = () => {
    setUserPermissions([]);
    localStorage.removeItem('userPermissions');
  };

  useEffect(() => {
    const storedPermissions = localStorage.getItem('userPermissions');
    if (storedPermissions) {
      setUserPermissions(JSON.parse(storedPermissions));
    }
  }, []);

  const contextValue: PermissionsContextType = {
    userPermissions,
    setPermissions,
    clearPermissions,
  };

  return <PermissionsContext.Provider value={contextValue}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};