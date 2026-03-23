import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = () => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: title })
    })
      .then((response) => response.json())
      .then(() => {
        setTitle("");
        fetchTasks();
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handleDeleteTask = (id) => {
    console.log("Deleting task with id:", id);

    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
      method: "DELETE"
    })
      .then((response) => {
        console.log("Delete response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Delete response data:", data);
        fetchTasks();
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
  <div className="container">
    <div className="card">
      <h1>Task Manager DevOps Project</h1>

      <form onSubmit={handleAddTask} className="form">
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span>
              {task.title} - <b>{task.status}</b>
            </span>
            <button
              type="button"
              onClick={() => handleDeleteTask(task.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

export default App;