import { useState, useEffect } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function CalendarWidget() {
  const { events, addEvent, deleteEvent } = useCalendar();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [openDialog, setOpenDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    const selectedDateString = selectedDate
      ? selectedDate.toLocaleDateString("en-AU")
      : today.toLocaleDateString("en-AU");
    setFilteredEvents(events.filter((event) => event.date === selectedDateString));
  }, [events, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleAddEvent = () => {
    if (eventTitle.trim() && selectedDate) {
      addEvent(selectedDate.toLocaleDateString("en-AU"), eventTitle, eventDescription);
      setEventTitle("");
      setEventDescription("");
      setOpenDialog(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5, textAlign: "center" }}>
      <Typography variant="h5" sx={{ marginTop: 3, textAlign: "center" }}>
        Calendar
      </Typography>

      {/* Calendar View */}
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Calendar onClickDay={handleDateChange} />
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
            Add Event
          </Button>
        </Box>
      </Paper>

      {/* Event List */}
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h6">Scheduled Events</Typography>
        {filteredEvents.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 2 }}>
            No events for this date.
          </Typography>
        ) : (
          <List>
            {filteredEvents.map((event) => (
              <ListItem
                key={event.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteEvent(event.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={event.title} secondary={event.description} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent> 
          { selectedDate ? <Typography variant="body2" sx={{ mb: 2 }}>
            Selected Date: {selectedDate.toLocaleDateString("en-AU")}
          </Typography> : null }
          
          <TextField
            label="Event Title"
            fullWidth
            margin="normal"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained" color="secondary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
      </Paper>
    </Container>
  );
}
