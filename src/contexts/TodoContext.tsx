import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define task structure
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

// Define context structure
interface TodoContextType {
  tasks: Task[];
  addTask: (text: string, priority: "High" | "Medium" | "Low") => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  filterPriority: string;
  setfilterPriority: (priority: string) => void;
}

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider component
export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterPriority, setfilterPriority] = useState("All");

  // Load tasks from local storage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (text: string, priority: "High" | "Medium" | "Low") => {
    setTasks([...tasks, { id: Date.now().toString(), text, completed: false, priority }]);
  };

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TodoContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, filterPriority, setfilterPriority}}>
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
