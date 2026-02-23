"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// IMPORT the colors from your framework file
import { AREA_COLORS } from "@/app/lib/expert-framework"; 

// Helper to handle the transparency for the backgrounds
const getBgTint = (hex: string, opacity: number) => {
  // Converts #3b82f6 to rgba(59, 130, 246, opacity)
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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
  const [latestExpert, setLatestExpert] = useState<AssessmentData | null>(null);
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
        const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
        const [userRes, assessmentRes, expertRes] = await Promise.all([
          fetch(`${API_URL}/api/me`, { headers }),
          fetch(`${API_URL}/api/assessments/latest`, { headers }),
          fetch(`${API_URL}/api/assessments/expert/latest`, { headers })
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (assessmentRes.ok) setLatestAssessment(await assessmentRes.json());
        if (expertRes.ok) setLatestExpert(await expertRes.json());
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Dashboard...</div>;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center h-fit">
          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 uppercase">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <h2 className="font-bold text-slate-800">{user?.first_name} {user?.last_name}</h2>
          <p className="text-xs text-slate-400 mb-6 capitalize">{user?.role} Account</p>
          <button onClick={() => router.push("/dashboard/settings")} className="w-full py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition">Settings</button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DETAILED (LIGHT) CARD */}
          {latestAssessment && (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Simplified Entrecomp Profile</h3>
                <button onClick={() => router.push("/results")} className="font-bold text-xs hover:underline" style={{ color: AREA_COLORS["Ideas & Opportunities"] }}>View Chart →</button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Ideas & Opportunities", "Resources", "Into Action"].map((area) => {
                  const label = area === "Ideas & Opportunities" ? "Ideas" : area === "Into Action" ? "Action" : "Resources";
                  const score = area === "Ideas & Opportunities" 
                    ? (latestAssessment.spotting_opportunities + latestAssessment.creativity + latestAssessment.vision + latestAssessment.valuing_ideas + latestAssessment.ethical_thinking) / 5
                    : area === "Resources"
                    ? (latestAssessment.self_awareness + latestAssessment.motivation + latestAssessment.mobilising_resources + latestAssessment.financial_literacy + latestAssessment.mobilising_others) / 5
                    : (latestAssessment.taking_initiative + latestAssessment.planning_management + latestAssessment.coping_with_ambiguity + latestAssessment.working_with_others + latestAssessment.learning_through_experience) / 5;

                  return (
                    <div key={area} className="p-4 rounded-2xl border" style={{ backgroundColor: getBgTint(AREA_COLORS[area], 0.08), borderColor: getBgTint(AREA_COLORS[area], 0.2) }}>
                      <p className="text-[10px] font-bold uppercase" style={{ color: AREA_COLORS[area] }}>{label}</p>
                      <p className="text-xl font-black" style={{ color: AREA_COLORS[area] }}>{score.toFixed(1)}</p>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => router.push("/assessment")} className="mt-6 w-full py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 transition">Update Simplified Entrecomp Profile</button>
            </div>
          )}

          {/* EXPERT (DARK) CARD */}
          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800 text-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">Expert</span>
                <h3 className="text-lg font-bold">Entrecomp Matrix</h3>
              </div>
              {latestExpert && <button onClick={() => router.push("/results/expert")} className="text-amber-500 font-bold text-xs hover:text-amber-400">View Entrecomp Matrix →</button>}
            </div>

            {latestExpert ? (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {["Ideas & Opportunities", "Resources", "Into Action"].map((area) => {
                  const label = area === "Ideas & Opportunities" ? "Ideas" : area === "Into Action" ? "Action" : "Resources";
                  const score = area === "Ideas & Opportunities" 
                    ? (latestExpert.spotting_opportunities + latestExpert.creativity + latestExpert.vision + latestExpert.valuing_ideas + latestExpert.ethical_thinking) / 5
                    : area === "Resources"
                    ? (latestExpert.self_awareness + latestExpert.motivation + latestExpert.mobilising_resources + latestExpert.financial_literacy + latestExpert.mobilising_others) / 5
                    : (latestExpert.taking_initiative + latestExpert.planning_management + latestExpert.coping_with_ambiguity + latestExpert.working_with_others + latestExpert.learning_through_experience) / 5;

                  return (
                    <div key={area} className="p-4 rounded-2xl border" style={{ backgroundColor: getBgTint(AREA_COLORS[area], 0.15), borderColor: getBgTint(AREA_COLORS[area], 0.4) }}>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: AREA_COLORS[area] }}>{label}</p>
                      <p className="text-2xl font-black text-white">{score.toFixed(1)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-sm mb-8">Unlock the 60-thread proficiency matrix to see your deep skills.</p>
            )}

            <button 
              onClick={() => router.push("/assessment/expert")}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 uppercase tracking-widest text-xs"
            >
              {latestExpert ? "Recalibrate Expert Skills" : "Begin Expert Analysis"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}