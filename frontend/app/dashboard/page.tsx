"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface AssessmentData {
  id: number;
  created_at: string;
  spotting_opportunities: number;
  creativity: number;
  vision: number;
  valuing_ideas: number;
  ethical_thinking: number;
  self_awareness: number;
  motivation: number;
  mobilising_resources: number;
  financial_literacy: number;
  mobilising_others: number;
  taking_initiative: number;
  planning_management: number;
  coping_with_ambiguity: number;
  working_with_others: number;
  learning_through_experience: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 1. Fetch User Profile
        const userRes = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (userRes.status === 401) throw new Error("Unauthorized");
        if (!userRes.ok) throw new Error("Failed to fetch profile");
        
        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch Latest Assessment (INTEGRATED HERE)
        const assessmentRes = await fetch(`${API_URL}/api/assessments/latest`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (assessmentRes.ok) {
          const assessmentData = await assessmentRes.json();
          // Check if data exists and isn't just an empty message from the API
          if (assessmentData && assessmentData.id) {
            setLatestAssessment(assessmentData);
          }
        }
        
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err instanceof Error && err.message === "Unauthorized") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading dashboard...</div>;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user?.first_name?.[0].toUpperCase()}{user?.last_name?.[0].toUpperCase()}
          </div>
          <h2 className="font-bold text-xl">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm text-gray-400 capitalize">{user?.role} Account</p>
          <div className="w-full h-px bg-gray-100 my-6"></div>
          <button 
                onClick={() => router.push("/dashboard/settings")}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
                Update Password
            </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {latestAssessment ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your EntreComp Profile</h3>
                  <p className="text-sm text-gray-500">Completed on {new Date(latestAssessment.created_at).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => router.push("/results")}
                  className="text-blue-600 font-bold hover:underline"
                >
                  View Full Chart →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Ideas</p>
                  <p className="text-lg font-black text-blue-700">
                    {((latestAssessment.spotting_opportunities + latestAssessment.creativity + latestAssessment.vision + latestAssessment.valuing_ideas + latestAssessment.ethical_thinking) / 5).toFixed(1)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-purple-400 mb-1">Resources</p>
                  <p className="text-lg font-black text-purple-700">
                    {((latestAssessment.self_awareness + latestAssessment.motivation + latestAssessment.mobilising_resources + latestAssessment.financial_literacy + latestAssessment.mobilising_others) / 5).toFixed(1)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-green-400 mb-1">Action</p>
                  <p className="text-lg font-black text-green-700">
                    {((latestAssessment.taking_initiative + latestAssessment.planning_management + latestAssessment.coping_with_ambiguity + latestAssessment.working_with_others + latestAssessment.learning_through_experience) / 5).toFixed(1)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => router.push("/assessment")}
                className="mt-8 w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition"
              >
                Retake Assessment
              </button>
            </div>
          ) : (
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Ready to grow?</h3>
                <p className="text-gray-400 mb-6">You haven't completed any assessments yet.</p>
                <button 
                  onClick={() => router.push("/assessment")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition">
                  Begin Assessment
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}