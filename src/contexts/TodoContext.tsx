import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "./AuthContext"; // Get the user ID from Firebase Auth

// Define task structure
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  userId: string;
}

// Define context structure
interface TodoContextType {
  tasks: Task[];
  addTask: (text: string, priority: "High" | "Medium" | "Low") => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
}

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider component
export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Get logged-in user
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterPriority, setFilterPriority] = useState("All");

  // Fetch tasks from Firestore when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userTasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(userTasks);
    };

    fetchTasks();
  }, [user]);

  // Add a new task to Firestore
  const addTask = async (text: string, priority: "High" | "Medium" | "Low") => {
    if (!user) return;

    const newTask = { text, completed: false, priority, userId: user.uid };
    const docRef = await addDoc(collection(db, "tasks"), newTask);
    setTasks([...tasks, { id: docRef.id, ...newTask }]);
  };

  // Toggle task completion in Firestore
  const toggleTask = async (id: string) => {
    if (!user) return;

    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { completed: !task.completed });

    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Delete task from Firestore
  const deleteTask = async (id: string) => {
    if (!user) return;

    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TodoContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, filterPriority, setFilterPriority }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the TodoContext
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodo must be used within a TodoProvider");
  return context;
};
