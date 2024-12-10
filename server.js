import express from "express";
import { connect } from "./config/db.js";
import feedbackRoutes from "./routes/feedback.js"; // Feedback route
import userRoutes from "./routes/user.js"; // User route

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/user", userRoutes);

// Connect to MongoDB
connect();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
