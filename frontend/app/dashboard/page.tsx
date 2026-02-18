"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Get the role
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If the backend says the token is invalid, THEN log out
        throw new Error("Session expired");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      localStorage.clear();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [router]);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading profile...</div>;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <header className="mb-12">
        <h1>
            Hello, <span className="text-blue-600">
                {user?.first_name} {user?.last_name}
            </span>!
        </h1>
        <p className="text-gray-500 mt-2">Account: {user?.email}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <h2 className="font-bold text-xl">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm text-gray-400 capitalize">{user?.role} Account</p>
          <div className="w-full h-px bg-gray-100 my-6"></div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your profile is verified. You can now access all competence assessment areas.
          </p>
        </div>

        {/* Status Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Ready to grow?</h3>
              <p className="text-gray-400 mb-6">You haven't completed any assessments yet.</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition">
                Begin Assessment
              </button>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}