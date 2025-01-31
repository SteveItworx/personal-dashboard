import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import WeatherWidget from "../components/WeatherWidget";
import TodoList from "../components/TodoList";
import NewsWidget from "../components/NewsWidget";
import CalendarWidget from "../components/CalendarWidget";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeCustom } from "../contexts/ThemeContext";
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

  const handleWidgetChange = (event: any) => {
    const widget = event.target.name;
    if (event.target.checked) {
      addWidget(widget);
    } else {
      removeWidget(widget);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" color="transparent">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Dashboard</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">Welcome, {user?.email}</Typography>
            <IconButton onClick={toggleTheme}>
              {mode === "dark" ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ width: "100%", marginTop: 6 }}>
        {/* Widget Selector */}
        <FormControl component="fieldset" sx={{ marginTop: 2 }}>
          <Typography variant="h6">Select Widgets</Typography>
          <Box display="flex" flexDirection="row" gap={2}>
            <FormControlLabel
              control={<Checkbox checked={widgets.includes("Weather")} onChange={handleWidgetChange} name="Weather" color="secondary"/>}
              label="Weather"
            />
            <FormControlLabel
              control={<Checkbox checked={widgets.includes("ToDoList")} onChange={handleWidgetChange} name="ToDoList" color="secondary"/>}
              label="To-Do List"
            />
            <FormControlLabel
              control={<Checkbox checked={widgets.includes("News")} onChange={handleWidgetChange} name="News" color="secondary"/>}
              label="News"
            />
            <FormControlLabel
              control={<Checkbox checked={widgets.includes("Calendar")} onChange={handleWidgetChange} name="Calendar" color="secondary"/>}
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
    </>
  );
}
