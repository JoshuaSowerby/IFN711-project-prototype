const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

// Import Routes
const authRoutes = require("./routes/authRoutes");
const scoreHistoryRoutes = require("./routes/scoreHistoryRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const exerciseHistoryRoutes = require("./routes/exerciseHistoryRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
//app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scoreHistory", scoreHistoryRoutes);
app.use("/api/exerciseHistory", exerciseHistoryRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));