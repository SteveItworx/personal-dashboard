import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "./AuthContext"; // Ensure user is authenticated

interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  userId: string;
}

interface CalendarContextType {
  events: Event[];
  addEvent: (date: string, title: string, description: string) => void;
  deleteEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Get the authenticated user
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch user's events from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const q = query(collection(db, "calendarEvents"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userEvents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(userEvents);
    };

    fetchEvents();
  }, [user]);

  // Add a new event to Firestore
  const addEvent = async (date: string, title: string, description: string) => {
    if (!user) return;

    try {
      const newEvent = { date, title, description, userId: user.uid };
      const docRef = await addDoc(collection(db, "calendarEvents"), newEvent);
      setEvents([...events, { id: docRef.id, ...newEvent }]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Delete event from Firestore
  const deleteEvent = async (id: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "calendarEvents", id));
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <CalendarContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook to use CalendarContext
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider");
  return context;
};
