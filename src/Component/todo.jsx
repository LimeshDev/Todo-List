import React, { useState, useEffect } from "react";
import "./TodoApp.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  const handleAddOrUpdateTask = () => {
    if (input.trim() === "") return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? { ...task, text: input, time: new Date().toLocaleString() }
            : task
        )
      );
      setEditId(null);
      setInput("");
    } else {
      const newTask = {
        id: Date.now(),
        text: input,
        completed: false,
        time: new Date().toLocaleString(),
      };
      setTasks([newTask, ...tasks]);
      setInput("");
    }
  };

  const handleDeleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const handleToggleComplete = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const handleDeleteAll = () => {
    if (window.confirm("Delete all tasks?")) setTasks([]);
  };

  const handleEditTask = (task) => {
    setInput(task.text);
    setEditId(task.id);
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="todo-container">
      <h1 className="title">My Todo List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Write your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddOrUpdateTask()}
        />
        <button onClick={handleAddOrUpdateTask} className="add-btn">
          {editId ? "Update" : "Add"}
        </button>
        <button onClick={handleDeleteAll} className="delete-all-btn">
          Delete All
        </button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="no-task"> No tasks yet — add one!</p>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div
                className="task-info"
                onClick={() => handleToggleComplete(task.id)}
              >
                <span className="task-text">{task.text}</span>
                <span className="task-time">{task.time}</span>
              </div>

              <div className="task-actions">
                <button className="edit-btn" onClick={() => handleEditTask(task)}>
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoApp;
