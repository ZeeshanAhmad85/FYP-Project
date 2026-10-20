"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface TabsContextProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

// Create the context
const TabsContext = createContext<TabsContextProps | undefined>(undefined);

// Custom hook to use the TabsContext
export const useTabs = (): TabsContextProps => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

// Provider component
interface TabsProviderProps {
  children: ReactNode;
}

export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};
