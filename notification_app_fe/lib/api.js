const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN = "YOUR_BEARER_TOKEN_HERE"; // Replace with your actual token

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// Logging Middleware
export async function Log(stack, level, pkg, message) {
  try {
    await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    // silent fail
  }
}

// Fetch Notifications
export async function fetchNotifications(params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit);
  if (params.page) query.append("page", params.page);
  if (params.notification_type) query.append("notification_type", params.notification_type);

  await Log("frontend", "info", "api", `Fetching notifications with params: ${query.toString()}`);

  try {
    const res = await fetch(`${BASE_URL}/notifications?${query}`, { headers });
    if (!res.ok) {
      await Log("frontend", "error", "api", `Failed to fetch notifications: ${res.status}`);
      throw new Error("Failed to fetch");
    }
    const data = await res.json();
    await Log("frontend", "info", "api", `Fetched ${data.notifications?.length} notifications`);
    return data.notifications || [];
  } catch (err) {
    await Log("frontend", "error", "api", `Error fetching notifications: ${err.message}`);
    throw err;
  }
}