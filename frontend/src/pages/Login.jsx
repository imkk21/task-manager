import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-80 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          onChange={handleChange}
        />

        <button className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">
          Login
        </button>

        <p className="mt-3 text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
