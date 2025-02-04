import { useState } from "react";
import { useTodo } from "../contexts/TodoContext";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const priorities = ["High", "Medium", "Low"];

export default function TodoList() {
  const { tasks, addTask, toggleTask, deleteTask, filterPriority, setFilterPriority } = useTodo();
  const [taskText, setTaskText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleAddTask = () => {
    if (taskText.trim()) {
      addTask(taskText, selectedPriority);
      setTaskText("");
    }
  };

  const filteredTasks = filterPriority === "All" ? tasks : tasks.filter((task) => task.priority === filterPriority);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5, textAlign: "center" }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          To-Do List
        </Typography>

        {/* Task Input */}
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          margin="normal"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />

        {/* Priority Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel variant="filled">Priority</InputLabel>
          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as "High" | "Medium" | "Low")}
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add Task Button */}
        <Button variant="contained" color="secondary" fullWidth onClick={handleAddTask} sx={{ marginBottom: 2 }}>
          Add Task
        </Button>

        {/* Priority Filter */}
        <FormControl fullWidth margin="normal">
          <InputLabel variant="filled">Filter by Priority</InputLabel>
          <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Task List */}
        <List sx={{ marginTop: 2 }}>
          {filteredTasks.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", marginTop: 2 }}>
              No tasks found.
            </Typography>
          ) : (
            filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                <ListItemText
                  primary={task.text}
                  secondary={`Priority: ${task.priority}`}
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green",
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}
