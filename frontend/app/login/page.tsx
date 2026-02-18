"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Use environment variable with a fallback to localhost
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // FastAPI's OAuth2PasswordRequestForm requires URLSearchParams
    const formData = new URLSearchParams();
    formData.append("username", email); // Backend expects 'username' for the login ID
    formData.append("password", password);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed. Check your credentials.");
      }

      const data = await response.json();

      // Store the token and role for authenticated requests
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      // Redirect based on the role assigned in the database
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Log in to your account</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 mt-4"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}