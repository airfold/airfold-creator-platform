import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AppContextValue {
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  selectedAppId: null,
  setSelectedAppId: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{ selectedAppId, setSelectedAppId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useSelectedApp() {
  return useContext(AppContext);
}
