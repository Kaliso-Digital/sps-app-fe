// ReferenceDataContext.tsx
import { toast } from 'react-toastify';
import { fetchData } from "../Service/apiService";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ReferenceData {
  categories: Record<string, Category>;
  companyType: { id: number; name: string }[];
  role: { id: number; name: string }[];
  service: { id: number; name: string; description: string | null }[];
  shippingType: { id: string; name: string }[];
  stage: { id: number; name: string }[];
}

interface Category {
  id: number;
  name: string;
  subcategories?: Category[];
}

const ReferenceDataContext = createContext<ReferenceData | null>(null);

export const ReferenceDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const data = await fetchData('get-reference-data');
        if (data) {
          setReferenceData(data.data);
        }
      } catch (error) {
        toast.error(`Something went wrong! ${error}`);
      }
    };

    fetchReferenceData();
  }, []);

  return (
    <ReferenceDataContext.Provider value={referenceData}>
      {children}
    </ReferenceDataContext.Provider>
  );
};

export const useReferenceData = () => {
  const context = useContext(ReferenceDataContext);
  // if (!context && !isLoading) {
  //   throw new Error(
  //     "useReferenceData must be used within a ReferenceDataProvider"
  //   );
  // }
  return context;
};
