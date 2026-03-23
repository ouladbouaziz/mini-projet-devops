const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *",
      [title, "pending"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ message: "Server error while adding task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const checkTask = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);

    if (checkTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfully:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
});