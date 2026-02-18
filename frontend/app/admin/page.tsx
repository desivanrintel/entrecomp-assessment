"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // Simple client-side protection
    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  if (!isAdmin) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="p-8 max-w-6xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Assessment Results</h2>
          <p className="text-gray-600">Overview of all user submissions and scores.</p>
        </header>

        {/* Placeholder for Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No data to display yet</h3>
            <p className="text-gray-500 mt-2">When users complete the EntreComp assessment, their results will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}