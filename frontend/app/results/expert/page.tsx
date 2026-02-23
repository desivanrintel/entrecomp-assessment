"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, PolarRadiusAxis 
} from "recharts";
import { EXPERT_ASSESSMENT_FRAMEWORK, AREA_COLORS } from "@/app/lib/expert-framework";

interface ExpertChartData {
  subject: string;
  ideasScore: number | null;
  resourcesScore: number | null;
  actionScore: number | null;
  fullMark: number;
}

export default function ExpertResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/expert/latest`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch results");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Profile...</div>;
  if (!data) return <div className="text-center mt-20">No assessment found.</div>;

  
  // Format data for Radar Chart
  const chartData: ExpertChartData[] = EXPERT_ASSESSMENT_FRAMEWORK.map(comp => ({
        subject: comp.name,
    // We use the specific area keys, NO property named 'score'
    ideasScore: comp.area === "Ideas & Opportunities" ? (data[comp.id] || 0) : null,
    resourcesScore: comp.area === "Resources" ? (data[comp.id] || 0) : null,
    actionScore: comp.area === "Into Action" ? (data[comp.id] || 0) : null,
    fullMark: 8,
}));

  return (
    <main className="min-h-screen bg-[#fcfcfd] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900">Your Entrepreneurial DNA</h1>
          <p className="text-slate-500 mt-2">Expert-level proficiency across 60 building blocks.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Radar Chart */}
          <div className="h-[500px] bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
      <PolarGrid stroke="#e2e8f0" />
      <PolarAngleAxis 
        dataKey="subject" 
        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
      />
      <PolarRadiusAxis 
        angle={30} 
        domain={[0, 8]} 
        tickCount={9} 
        tick={{ fontSize: 10, fill: '#cbd5e1' }}
      />

      {/* Radar for Ideas & Opportunities (Blue/Primary) */}
      <Radar
    name="Ideas & Opportunities"
    dataKey="ideasScore"  // <--- This must match the interface key
    stroke={AREA_COLORS["Ideas & Opportunities"]}
    fill={AREA_COLORS["Ideas & Opportunities"]}
    fillOpacity={0.5}
    connectNulls={true} 
    />

    {/* Resources Radar */}
    <Radar
    name="Resources"
    dataKey="resourcesScore" // <--- This must match the interface key
    stroke={AREA_COLORS["Resources"]}
    fill={AREA_COLORS["Resources"]}
    fillOpacity={0.5}
    connectNulls={true}
    />

    {/* Action Radar */}
    <Radar
    name="Into Action"
    dataKey="actionScore" // <--- This must match the interface key
    stroke={AREA_COLORS["Into Action"]}
    fill={AREA_COLORS["Into Action"]}
    fillOpacity={0.5}
    connectNulls={true}
    />
    </RadarChart>
  </ResponsiveContainer>
</div>

        

         {/* Top Strengths Summary */}
<div className="space-y-6">
  <h2 className="text-2xl font-black text-slate-900">Core Competence Averages</h2>
  <div className="grid grid-cols-1 gap-3">
    {chartData
      .map(item => ({
        ...item,
        // Create a temporary 'displayScore' to use for sorting and showing
        displayScore: item.ideasScore || item.resourcesScore || item.actionScore || 0
      }))
      .sort((a, b) => b.displayScore - a.displayScore) // Sort by the calculated score
      .slice(0, 5)
      .map(item => (
        <div key={item.subject} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-700">{item.subject}</span>
          <span className="text-blue-600 font-black">
            Lvl {item.displayScore.toFixed(1)}
          </span>
        </div>
      ))}
  </div>
</div>
</div>
        {/* Detailed Thread Breakdown */}
        <h2 className="text-3xl font-black text-slate-900 mb-8">Detailed Thread Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EXPERT_ASSESSMENT_FRAMEWORK.map((comp) => (
            <div key={comp.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: AREA_COLORS[comp.area] }} />
                <h3 className="text-xl font-black text-slate-900">{comp.name}</h3>
              </div>
              
              <div className="space-y-4">
                {comp.threads.map(thread => (
                  <div key={thread.id}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500">{thread.title}</span>
                      <span style={{ color: AREA_COLORS[comp.area] }}>Level {data.thread_scores[thread.id]}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${(data.thread_scores[thread.id] / 8) * 100}%`,
                          backgroundColor: AREA_COLORS[comp.area]
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </main>
  );
}