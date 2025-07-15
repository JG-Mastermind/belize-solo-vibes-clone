import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdventureCreationData {
  title?: string;
  description?: string;
  image?: string;
}

interface AdventureCreationContextType {
  prefilledData: AdventureCreationData | null;
  setPrefilledData: (data: AdventureCreationData) => void;
  clearPrefilledData: () => void;
}

const AdventureCreationContext = createContext<AdventureCreationContextType | undefined>(undefined);

export const useAdventureCreation = () => {
  const context = useContext(AdventureCreationContext);
  if (!context) {
    throw new Error('useAdventureCreation must be used within an AdventureCreationProvider');
  }
  return context;
};

interface AdventureCreationProviderProps {
  children: ReactNode;
}

export const AdventureCreationProvider: React.FC<AdventureCreationProviderProps> = ({ children }) => {
  const [prefilledData, setPrefilledDataState] = useState<AdventureCreationData | null>(null);

  const setPrefilledData = (data: AdventureCreationData) => {
    setPrefilledDataState(data);
    // Optionally store in localStorage for persistence across navigation
    localStorage.setItem('adventure_prefill_data', JSON.stringify(data));
  };

  const clearPrefilledData = () => {
    setPrefilledDataState(null);
    localStorage.removeItem('adventure_prefill_data');
  };

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('adventure_prefill_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setPrefilledDataState(data);
      } catch (error) {
        console.error('Error parsing stored adventure data:', error);
        localStorage.removeItem('adventure_prefill_data');
      }
    }
  }, []);

  return (
    <AdventureCreationContext.Provider
      value={{
        prefilledData,
        setPrefilledData,
        clearPrefilledData,
      }}
    >
      {children}
    </AdventureCreationContext.Provider>
  );
};