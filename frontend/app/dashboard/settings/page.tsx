"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Success! Redirecting to dashboard..." });
        // Redirect after a short delay so they can see the success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const data = await response.json();
        setStatus({ type: "error", message: data.detail || "Update failed" });
        setIsSubmitting(false);
      }
    } catch (err) {
      setStatus({ type: "error", message: "Server error. Try again later." });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>
      
      <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-500 mb-8">Update your password to keep your account secure.</p>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${
              status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gray-900 text-white rounded-xl font-bold transition shadow-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </main>
  );
}