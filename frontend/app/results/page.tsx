"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; 
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Legend, Cell 
} from "recharts";
import { ENTRECOMP_STEPS } from "@/app/lib/constants";

// Official EntreComp Area Colors
const AREA_COLORS: Record<string, string> = {
  "Ideas & Opportunities": "#3b82f6", // Blue
  "Resources": "#f59e0b",             // Orange/Amber
  "Into Action": "#10b981"            // Green
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const adminTargetId = searchParams.get("user_id"); 
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const url = adminTargetId 
        ? `${API_URL}/api/admin/users/${adminTargetId}/latest` 
        : `${API_URL}/api/assessments/latest`;

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();

        if (result && !result.message) {
          if (result.user_name) setUserName(result.user_name);

          const chartData = ENTRECOMP_STEPS.flatMap(step => 
            step.fields.map(field => ({
              subject: field.label,
              score: result[field.key],
              fullMark: 8,
              area: step.area,
              // Map the color based on the area name
              color: AREA_COLORS[step.area] || "#94a3b8" 
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

  if (loading) return <div className="p-20 text-center animate-pulse">Loading DNA profile...</div>;
  if (data.length === 0) return <div className="p-20 text-center text-gray-400">No assessment data found.</div>;

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

        <div className="bg-gray-50 rounded-3xl p-4 md:p-8 border border-gray-100 shadow-inner">
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={({ x, y, payload }) => {
                    // Find the area color for this specific tick
                    const areaColor = data.find(d => d.subject === payload.value)?.color;
                    return (
                      <text x={x} y={y} fill={areaColor} fontSize={10} fontWeight={700} textAnchor="middle" dy={4}>
                        {payload.value}
                      </text>
                    );
                  }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 8]} 
                  tickCount={9} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false} 
                />
                <Radar 
                  name="Proficiency Level" 
                  dataKey="score" 
                  stroke="#1e293b" 
                  strokeWidth={2} 
                  fill="#94a3b8" 
                  fillOpacity={0.3} 
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proficiency Level Legend Section */}
        <div className="mt-12 bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 italic underline decoration-blue-500">Proficiency Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-gray-300">
              <span className="font-bold text-sm text-gray-700 block mb-1">Foundation (1-2)</span>
              <p className="text-xs text-gray-500 leading-tight">Working under direct supervision with others.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-400">
              <span className="font-bold text-sm text-blue-700 block mb-1">Intermediate (3-4)</span>
              <p className="text-xs text-gray-500 leading-tight">Building independence and autonomy.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-indigo-500">
              <span className="font-bold text-sm text-indigo-700 block mb-1">Advanced (5-6)</span>
              <p className="text-xs text-gray-500 leading-tight">Taking responsibility for decisions and teams.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-purple-600">
              <span className="font-bold text-sm text-purple-700 block mb-1">Expert (7-8)</span>
              <p className="text-xs text-gray-500 leading-tight">Driving innovation and transformation.</p>
            </div>
          </div>
        </div>

        {/* Summary Cards with Area Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {ENTRECOMP_STEPS.map((step) => {
            const areaColor = AREA_COLORS[step.area];
            const avg = (data
              .filter(d => d.area === step.area)
              .reduce((acc, curr) => acc + curr.score, 0) / 5).toFixed(1);
            
            return (
              <div 
                key={step.area} 
                className="p-6 bg-white rounded-2xl border shadow-sm transition-transform hover:scale-105"
                style={{ borderColor: `${areaColor}20`, borderTop: `4px solid ${areaColor}` }}
              >
                <h3 className="font-bold text-gray-900 mb-1">{step.area}</h3>
                <div className="text-3xl font-black mb-2" style={{ color: areaColor }}>{avg} / 8</div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Average Score</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}