import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setTask("");
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== id)
    );
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, text: editingText.trim() }
          : todo
      )
    );

    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => !todo.completed)
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;

    return true;
  });

  const totalTasks = todos.length;
  const completedTasks = todos.filter(
    (todo) => todo.completed
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app">
      <div className="todo-container">

        {/* Header */}
        <header className="header">
          <div>
            <h1>My Todo List</h1>
            <p>Organize your day and stay productive.</p>
          </div>

          <div className="header-icon">✓</div>
        </header>

        {/* Add Todo */}
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button type="submit" className="add-btn">
            + Add Task
          </button>
        </form>

        {/* Statistics */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{totalTasks}</span>
            <span className="stat-label">Total</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{pendingTasks}</span>
            <span className="stat-label">Pending</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Filters */}
        <div className="toolbar">
          <div className="filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>

            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          {completedTasks > 0 && (
            <button
              className="clear-btn"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="todo-list">

          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h3>
                {filter === "completed"
                  ? "No completed tasks"
                  : filter === "active"
                  ? "No pending tasks"
                  : "No tasks yet"}
              </h3>

              <p>
                {filter === "all"
                  ? "Add your first task to get started."
                  : "There are no tasks in this category."}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                className={`todo-item ${
                  todo.completed ? "todo-completed" : ""
                }`}
                key={todo.id}
              >

                {/* Checkbox */}
                <button
                  className={`checkbox ${
                    todo.completed ? "checked" : ""
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && "✓"}
                </button>

                {/* Todo Content */}
                <div className="todo-content">

                  {editingId === todo.id ? (
                    <input
                      className="edit-input"
                      value={editingText}
                      onChange={(e) =>
                        setEditingText(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(todo.id);
                        }

                        if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="todo-text">
                      {todo.text}
                    </span>
                  )}

                  {todo.completed && (
                    <span className="completed-label">
                      Completed
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="actions">

                  {editingId === todo.id ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(todo.id)}
                      >
                        Save
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(todo)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}

                </div>
              </div>
            ))
          )}

        </div>

        {/* Footer */}
        <footer className="footer">
          <span>
            {pendingTasks} {pendingTasks === 1 ? "task" : "tasks"} remaining
          </span>

          <span>React Todo App</span>
        </footer>

      </div>
    </div>
  );
}

export default App;