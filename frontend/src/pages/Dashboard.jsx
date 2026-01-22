import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { logout } = useAuth();

  // ✅ keep fetchTasks as a normal async function
  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data);
  };

  const addTask = async () => {
    if (!title) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      status: task.status === "pending" ? "completed" : "pending"
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // ✅ FIXED useEffect (eslint-safe)
  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : task.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search tasks..."
          className="flex-1 p-2 bg-gray-700 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-gray-700 p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="flex-1 p-2 bg-gray-700 rounded mr-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 px-4 rounded"
        >
          Add
        </button>
      </div>

      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="flex justify-between bg-gray-800 p-3 mb-2 rounded"
        >
          <span
            onClick={() => toggleTask(task)}
            className={`cursor-pointer ${
              task.status === "completed"
                ? "line-through text-green-400"
                : ""
            }`}
          >
            {task.title}
          </span>
          <button
            onClick={() => deleteTask(task._id)}
            className="text-red-400"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
