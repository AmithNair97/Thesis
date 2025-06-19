"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type DatasetContextType = {
  selectedDataset: string;
  setSelectedDataset: (dataset: string) => void;
};

// ✅ Export the context for external access
export const DatasetContext = createContext<DatasetContextType | null>(null);

export const DatasetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDataset, setSelectedDataset] = useState<string>("");

  return (
    <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset }}>
      {children}
    </DatasetContext.Provider>
  );
};

// ✅ Safe custom hook
export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error("❌ useDataset must be used within a DatasetProvider");
  }
  return context;
};
