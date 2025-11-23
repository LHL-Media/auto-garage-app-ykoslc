
import * as React from "react";
import { createContext, useCallback, useContext } from "react";

console.log('🔧 WidgetContext loaded');

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  console.log('🔧 WidgetProvider rendering');

  const refreshWidget = useCallback(() => {
    console.log('🔄 Widget refresh requested');
    // Widget functionality can be added later if needed
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
