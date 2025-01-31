import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
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
  const { widgets, addWidget, removeWidget } = useWidgets();

  const handleWidgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const widget = event.target.name as "Weather" | "ToDoList" | "News" | "Calendar";
    if (event.target.checked) {
      addWidget(widget);
    } else {
      removeWidget(widget);
    }
  };

  return (
    <Container component="main" sx={{ width: "100%" }}>
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
      <FormControl component="fieldset" sx={{ marginTop: 2 }}>
        <Typography variant="h6">Select Widgets</Typography>
        <Box display="flex" flexDirection="row" gap={2}>
          <FormControlLabel
            control={<Checkbox checked={widgets.includes("Weather")} onChange={handleWidgetChange} name="Weather" />}
            label="Weather"
          />
          <FormControlLabel
            control={<Checkbox checked={widgets.includes("ToDoList")} onChange={handleWidgetChange} name="ToDoList" />}
            label="To-Do List"
          />
          <FormControlLabel
            control={<Checkbox checked={widgets.includes("News")} onChange={handleWidgetChange} name="News" />}
            label="News"
          />
          <FormControlLabel
            control={<Checkbox checked={widgets.includes("Calendar")} onChange={handleWidgetChange} name="Calendar" />}
            label="Calendar"
          />
       
        </Box>
      </FormControl>

      {/* Display Widgets in Grid Layout */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {widgets.includes("Weather") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">Weather</Typography>
              <WeatherWidget />
            </Paper>
          </Grid>
        )}

        {widgets.includes("ToDoList") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">To-Do List</Typography>
              <TodoList />
            </Paper>
          </Grid>
        )}

        {widgets.includes("Calendar") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">Calendar</Typography>
              <CalendarWidget />
            </Paper>
          </Grid>
        )}

        {widgets.includes("News") && (
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">News</Typography>
              <NewsWidget />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
