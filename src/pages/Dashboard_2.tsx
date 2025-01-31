import { useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import WeatherWidget from "../components/WeatherWidget";
import TodoList from "../components/TodoList";
import NewsWidget from "../components/NewsWidget";
import CalendarWidget from "../components/CalendarWidget";

const widgetsList = [
  { id: "weather", component: <WeatherWidget /> },
  { id: "todo", component: <TodoList /> },
  { id: "news", component: <NewsWidget /> },
  { id: "calendar", component: <CalendarWidget /> },
];

const DraggableDroppableWidget: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  // Draggable
  const { attributes, listeners, setNodeRef: setDragRef, transform } = useDraggable({ id });

  // Droppable
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: transform ? "none" : "transform 0.2s ease",
    cursor: "grab",
  };

  return (
    <Grid item xs={12} md={6} ref={(node) => { setDragRef(node); setDropRef(node); }} style={style} {...listeners} {...attributes}>
      <Paper elevation={3} sx={{ padding: 2 }}>{children}</Paper>
    </Grid>
  );
};

export default function Dashboard_2() {
  const [widgets, setWidgets] = useState(widgetsList);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === active.id);
    const newIndex = widgets.findIndex((w) => w.id === over.id);

    const updatedWidgets = [...widgets];
    const [movedWidget] = updatedWidgets.splice(oldIndex, 1);
    updatedWidgets.splice(newIndex, 0, movedWidget);

    setWidgets(updatedWidgets);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Container component="main">
        <Grid container spacing={2}>
          {widgets.map((widget) => (
            <DraggableDroppableWidget key={widget.id} id={widget.id}>
              {widget.component}
            </DraggableDroppableWidget>
          ))}
        </Grid>
      </Container>
    </DndContext>
  );
}
