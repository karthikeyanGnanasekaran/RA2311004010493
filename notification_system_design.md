# Notification System Design

## Overview
This project is a simple notification system where a user can send a message from the frontend, which is processed by the backend. A logging middleware is used to track all incoming requests.

## Architecture
Frontend → Backend → Logging Middleware

- Frontend: A basic HTML page where user enters a message
- Backend: Node.js (Express) server that handles API requests
- Middleware: Logs request details such as method, URL, and status

## Working Flow
1. User enters a message in the frontend UI
2. Frontend sends a POST request to `/notify`
3. Backend receives the request and validates input
4. Logging middleware logs the request details
5. Backend sends a response back to frontend
6. Frontend displays success or error message

## Logging
The middleware logs:
- Timestamp
- HTTP method (GET/POST)
- Request URL
- Response status code

Example:
[2026-05-02T05:35:42.305Z] POST /notify - 200

## Conclusion
This project demonstrates basic full-stack communication and middleware usage in a simple and understandable way.