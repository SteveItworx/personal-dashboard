import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define available widget types
export type WidgetType = "Weather" | "ToDoList" | "News" | "Calendar";

interface WidgetContextType {
  widgets: WidgetType[];
  addWidget: (widget: WidgetType) => void;
  removeWidget: (widget: WidgetType) => void;
  setWidgets: (widgets: WidgetType[]) => void;
}

// Create the Widget Context
const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
  const [widgets, setWidgets] = useState<WidgetType[]>(["Weather", "ToDoList"]); // Default widgets

  // Load saved widgets from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem("widgets");
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  // Save widget preferences to localStorage
  useEffect(() => {
    localStorage.setItem("widgets", JSON.stringify(widgets));
  }, [widgets]);

  // Add a new widget
  const addWidget = (widget: WidgetType) => {
    if (!widgets.includes(widget)) {
      setWidgets([...widgets, widget]);
    }
  };

  // Remove a widget
  const removeWidget = (widget: WidgetType) => {
    setWidgets(widgets.filter((w) => w !== widget));
  };

  return (
    <WidgetContext.Provider value={{ widgets, addWidget, removeWidget, setWidgets }}>
      {children}
    </WidgetContext.Provider>
  );
};

// Custom hook to use widgets
export const useWidgets = () => {
  const context = useContext(WidgetContext);
  if (!context) throw new Error("useWidgets must be used within a WidgetProvider");
  return context;
};
