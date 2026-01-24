import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";

import { BrainCircuit, Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ======================
  // EMAIL / PASSWORD LOGIN
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // GOOGLE LOGIN (FRONTEND ONLY)
  // ======================
  const handleGoogleSuccess = async (response) => {
  const idToken = response.credential;

  console.log("DOT COUNT:", idToken.split(".").length); // must be 3

  await axios.post(
    "http://localhost:8000/api/auth/google",
    { idToken },
    { headers: { "Content-Type": "application/json" } }
  );
};

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <BrainCircuit className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">AI Learning Assistant</h1>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label>Email</label>
          <div className="flex border px-3 py-2 rounded">
            <Mail className="mr-2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label>Password</label>
          <div className="flex border px-3 py-2 rounded">
            <Lock className="mr-2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* GOOGLE LOGIN */}
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
