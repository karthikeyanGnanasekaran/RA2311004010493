import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Chip,
  CircularProgress, Alert, Container
} from "@mui/material";
import Navbar from "../components/Navbar";
import { fetchNotifications, Log } from "../lib/api";

const typeColors = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    Log("frontend", "debug", "page", "All Notifications page loaded");
    const stored = JSON.parse(localStorage.getItem("viewedIds") || "[]");
    setViewed(stored);
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  function markRead(id) {
    const updated = [...viewed, id];
    setViewed(updated);
    localStorage.setItem("viewedIds", JSON.stringify(updated));
    Log("frontend", "info", "page", `Notification ${id} marked as read`);
  }

  const isViewed = (id) => viewed.includes(id);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" mb={3}>All Notifications</Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {notifications.map((n) => (
          <Card
            key={n.ID}
            onClick={() => !isViewed(n.ID) && markRead(n.ID)}
            sx={{
              mb: 2,
              cursor: "pointer",
              opacity: isViewed(n.ID) ? 0.5 : 1,
              borderLeft: isViewed(n.ID)
                ? "4px solid grey"
                : "4px solid #1976d2",
              transition: "opacity 0.3s",
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip
                  label={n.Type}
                  color={typeColors[n.Type] || "default"}
                  size="small"
                />
                {!isViewed(n.ID) && (
                  <Chip label="New" color="primary" size="small" />
                )}
              </Box>
              <Typography variant="h6" mt={1}>{n.Message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.Timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    </>
  );
}