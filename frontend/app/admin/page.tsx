"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ManagedUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  assessment_count: number; // New field
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      setIsAdmin(true);
      fetchUsers(token);
    }
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/toggle-active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
      }
    } catch (err) {
      alert("Error updating user status");
    }
  };

  if (!isAdmin) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-8 max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Review and activate registered accounts.</p>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
  <thead className="bg-gray-50/50 border-b border-gray-100">
    <tr>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Assessments</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-50">
    {users.map((u) => (
      <tr key={u.id} className="hover:bg-gray-50/30 transition-colors">
        <td className="px-6 py-4">
          <div className="font-semibold text-gray-900">{u.first_name} {u.last_name}</div>
          <div className="text-sm text-gray-500">{u.email}</div>
        </td>
        
        {/* Assessment Count and Link */}
        <td className="px-6 py-4 text-center">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-700">{u.assessment_count}</span>
            {u.assessment_count > 0 && (
              <button 
                onClick={() => router.push(`/admin/assessments/${u.id}`)}
                className="text-[10px] text-blue-600 font-bold uppercase hover:underline mt-1"
              >
                View Details
              </button>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
            u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {u.is_active ? "Active" : "Disabled"}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <button 
            onClick={() => toggleUserStatus(u.id)}
            className={`text-xs font-bold py-2 px-4 rounded-xl transition-all ${
              u.is_active 
                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                : 'text-green-600 bg-green-50 hover:bg-green-100'
            }`}
          >
            {u.is_active ? "Deactivate" : "Activate User"}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          )}
        </div>
      </main>
    </div>
  );
}