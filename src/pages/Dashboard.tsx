import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper } from "@mui/material";
import WeatherWidget from "../components/WeatherWidget";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5, textAlign: "center" }}>
        <Typography variant="h4">Welcome, {user?.email}</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginTop: 2 }}>
          Logout
        </Button>
      </Paper>

      {/* Weather Widget */}
      <WeatherWidget />
    </Container>
  );
}
