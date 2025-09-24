const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API running 🎯");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop server if DB connection fails
  });

// Placeholder API routes
app.get("/api/v1", (req, res) => {
  res.send("Backend is running!");
});

// API Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/transactions", require("./routes/transactions"));
app.use("/api/v1/budgets", require("./routes/budgets"));
app.use("/api/v1/category-goals", require("./routes/categoryBudgetRoutes"));
app.use("/api/v1/summary", require("./routes/summary"));
app.use("/api/v1/debts", require("./routes/debts"));
app.use("/api/v1/reminders", require("./routes/reminders"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
