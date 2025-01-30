import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface CalendarContextType {
  events: Event[];
  addEvent: (date: string, title: string, description: string) => void;
  deleteEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Add an event
  const addEvent = (date: string, title: string, description: string) => {
    setEvents([...events, { id: Date.now().toString(), date, title, description }]);
  };

  // Delete an eventa
  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <CalendarContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider");
  return context;
};
