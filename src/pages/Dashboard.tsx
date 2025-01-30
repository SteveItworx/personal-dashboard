import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
} from "@mui/material";
import WeatherWidget from "../components/WeatherWidget";
import TodoList from "../components/TodoList";
import NewsWidget from "../components/NewsWidget";
import CalendarWidget from "../components/CalendarWidget";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeCustom } from "../contexts/ThemeContext";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useWidgets } from "../contexts/WidgetContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const { mode, toggleTheme } = useThemeCustom();
  const { widgets, setWidgets, addWidget, removeWidget } = useWidgets();

  return (
    <Container component="main" maxWidth="lg">
      {/* Dark Mode Toggle */}
      <IconButton onClick={toggleTheme} sx={{ mt: 2 }}>
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 5, textAlign: "center" }}>
        <Typography variant="h4">Welcome, {user?.email}</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Logout
        </Button>
      </Paper>

      {/* Widget Selector */}
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel>Add Widget</InputLabel>
        <Select onChange={(e) => addWidget(e.target.value as "Weather" | "ToDoList" | "News" | "Calendar")}>
          <MenuItem value="Weather">Weather</MenuItem>
          <MenuItem value="ToDoList">To-Do List</MenuItem>
          <MenuItem value="News">News</MenuItem>
          <MenuItem value="Calendar">Calendar</MenuItem>
        </Select>
      </FormControl>

      {/* Display Widgets in Grid Layout */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {widgets.includes("Weather") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">Weather</Typography>
              <WeatherWidget />
              <IconButton onClick={() => removeWidget("Weather")} color="error">
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        )}

        {widgets.includes("ToDoList") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">To-Do List</Typography>
              <TodoList />
              <IconButton onClick={() => removeWidget("ToDoList")} color="error">
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        )}

        {widgets.includes("Calendar") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">Calendar</Typography>
              <CalendarWidget />
              <IconButton onClick={() => removeWidget("Calendar")} color="error">
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        )}

        {widgets.includes("News") && (
          <Grid item xs={12} sm={8} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">News</Typography>
              <NewsWidget />
              <IconButton onClick={() => removeWidget("News")} color="error">
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
