import { useState } from "react";
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
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import WeatherWidget from "../components/WeatherWidget";
import TodoList from "../components/TodoList";
import NewsWidget from "../components/NewsWidget";
import CalendarWidget from "../components/CalendarWidget";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeCustom } from "../contexts/ThemeContext";
import { useWidgets } from "../contexts/WidgetContext";

const widgetComponents = {
  Weather: <WeatherWidget />,
  ToDoList: <TodoList />,
  News: <NewsWidget />,
  Calendar: <CalendarWidget />,
};

// Draggable Widget Component (Only Active When Moving Mode is Enabled)
const DraggableWidget: React.FC<{ id: string; children: React.ReactNode; isMoving: boolean }> = ({ id, children, isMoving }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: !isMoving });
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: transform ? "none" : "transform 0.2s ease",
    cursor: isMoving ? "grab" : "default",
    pointerEvents: isMoving ? "auto" : "auto", // Allow interactions when not moving
  };

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={6}
      ref={(node) => {
        setNodeRef(node);
        setDropRef(node);
      }}
      style={style}
      {...(isMoving ? { ...listeners, ...attributes } : {})} // Apply listeners only when moving mode is active
    >
      <Paper elevation={2} sx={{ padding: 2 }}>{children}</Paper>
    </Grid>
  );
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeCustom();
  const { widgets, addWidget, removeWidget } = useWidgets();
  const [widgetOrder, setWidgetOrder] = useState(widgets);
  const [isMoving, setIsMoving] = useState(false); // Toggle for move mode

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Handle widget selection and ordering
  const handleWidgetChange = (event: any) => {
    const widget = event.target.name;
    if (event.target.checked) {
      addWidget(widget);
      setWidgetOrder([...widgetOrder, widget]); // Add to order list
    } else {
      removeWidget(widget);
      setWidgetOrder(widgetOrder.filter((w) => w !== widget)); // Remove from order list
    }
  };

  // Drag and Drop Handler (Only Active in Move Mode)
  const handleDragEnd = (event: DragEndEvent) => {
    if (!isMoving) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = widgetOrder.findIndex((w) => w === active.id);
    const newIndex = widgetOrder.findIndex((w) => w === over.id);

    const updatedOrder = [...widgetOrder];
    const [movedWidget] = updatedOrder.splice(oldIndex, 1);
    updatedOrder.splice(newIndex, 0, movedWidget);

    setWidgetOrder(updatedOrder);
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
            {Object.keys(widgetComponents).map((widget) => (
              <FormControlLabel
                key={widget}
                control={
                  <Checkbox
                    checked={widgets.includes(widget)}
                    onChange={handleWidgetChange}
                    name={widget}
                    color="secondary"
                  />
                }
                label={widget}
              />
            ))}
          </Box>
        </FormControl>

        {/* Move & Save Buttons */}
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          {!isMoving ? (
            <Button variant="contained" color="primary" onClick={() => setIsMoving(true)}>
              Move Widgets
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={() => setIsMoving(false)}>
              Save Layout
            </Button>
          )}
        </Box>

        {/* Draggable Widgets Grid */}
        <DndContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            {widgetOrder.map((widget) =>
              widgets.includes(widget) ? (
                <DraggableWidget key={widget} id={widget} isMoving={isMoving}>
                  <Typography variant="h6">{widget}</Typography>
                  {widgetComponents[widget]}
                </DraggableWidget>
              ) : null
            )}
          </Grid>
        </DndContext>
      </Container>
    </>
  );
}
