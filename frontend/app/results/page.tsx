"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Added for admin view
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Legend 
} from "recharts";
import { ENTRECOMP_STEPS } from "@/app/lib/constants";

// Sub-component to handle logic using searchParams
function ResultsContent() {
  const searchParams = useSearchParams();
  const adminTargetId = searchParams.get("user_id"); // Get ID from URL e.g., /results?user_id=5
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 1. Determine the endpoint
      // If adminTargetId exists, use the admin-specific route
      const url = adminTargetId 
        ? `${API_URL}/api/admin/users/${adminTargetId}/latest` 
        : `${API_URL}/api/assessments/latest`;

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();

        if (result && !result.message) {
          // If admin is viewing, the backend might include user name info
          if (result.user_name) setUserName(result.user_name);

          const chartData = ENTRECOMP_STEPS.flatMap(step => 
            step.fields.map(field => ({
              subject: field.label,
              score: result[field.key],
              fullMark: 8,
              area: step.area
            }))
          );
          setData(chartData);
        }
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [adminTargetId]);

  if (loading) return <div className="p-20 text-center">Loading DNA profile...</div>;
  if (data.length === 0) return <div className="p-20 text-center">No assessment data found.</div>;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            {userName ? `${userName}'s Profile` : "Your EntreComp Profile"}
          </h1>
          <p className="text-gray-500">Visualization of entrepreneurial proficiency levels (1-8)</p>
          {adminTargetId && (
            <span className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
              Admin View Mode
            </span>
          )}
        </header>

        {/* ... Rest of your existing chart and Area Summary JSX ... */}
        <div className="bg-gray-50 rounded-3xl p-4 md:p-8 border border-gray-100 shadow-inner">
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 8]} tickCount={9} tick={{ fontSize: 10 }} />
                <Radar name="Proficiency Level" dataKey="score" stroke="#2563eb" strokeWidth={3} fill="#3b82f6" fillOpacity={0.5} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {ENTRECOMP_STEPS.map((step) => {
            const avg = (data
              .filter(d => d.area === step.area)
              .reduce((acc, curr) => acc + curr.score, 0) / 5).toFixed(1);
            return (
              <div key={step.area} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">{step.area}</h3>
                <div className="text-3xl font-black text-blue-600 mb-2">{avg} / 8</div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Average Score</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// Main component with Suspense boundary (required by Next.js when using useSearchParams)
export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}