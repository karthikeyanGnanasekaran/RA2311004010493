import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Chip,
  CircularProgress, Alert, Container,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import Navbar from "../components/Navbar";
import { fetchNotifications, Log } from "../lib/api";

const typeColors = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

const WEIGHT = { Placement: 3, Result: 2, Event: 1 };

function priorityScore(n) {
  const weight = WEIGHT[n.Type] || 0;
  const time = new Date(n.Timestamp).getTime();
  return weight * 1e13 + time;
}

export default function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    Log("frontend", "debug", "page", "Priority Notifications page loaded");
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

  const filtered = notifications
    .filter((n) => filterType === "All" || n.Type === filterType)
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, limit);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" mb={3}>Priority Notifications</Typography>

        {/* Controls */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Show Top</InputLabel>
            <Select
              value={limit}
              label="Show Top"
              onChange={(e) => {
                setLimit(e.target.value);
                Log("frontend", "info", "page", `Limit changed to ${e.target.value}`);
              }}
            >
              {[5, 10, 15, 20].map((n) => (
                <MenuItem key={n} value={n}>Top {n}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              label="Filter by Type"
              onChange={(e) => {
                setFilterType(e.target.value);
                Log("frontend", "info", "page", `Filter changed to ${e.target.value}`);
              }}
            >
              {["All", "Placement", "Result", "Event"].map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {filtered.map((n, index) => (
          <Card
            key={n.ID}
            sx={{
              mb: 2,
              borderLeft: `4px solid ${
                n.Type === "Placement" ? "#2e7d32" :
                n.Type === "Result" ? "#ed6c02" : "#0288d1"
              }`,
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip
                  label={n.Type}
                  color={typeColors[n.Type] || "default"}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  #{index + 1}
                </Typography>
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