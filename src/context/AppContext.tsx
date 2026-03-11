import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  notificationsCount: number;
  setNotificationsCount: (count: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(3);

  return (
    <AppContext.Provider value={{ user, setUser, notificationsCount, setNotificationsCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
