"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EXPERT_ASSESSMENT_FRAMEWORK, AREA_COLORS } from "@/app/lib/expert-framework";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function ExpertAssessmentPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // View states for intermediate stopping points
  const [showCompSummary, setShowCompSummary] = useState(false);
  const [showAreaChart, setShowAreaChart] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchExistingExpertData = async () => {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      if (!token) { setFetching(false); return; }
      try {
        const response = await fetch(`${API_URL}/api/assessments/expert/latest`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.thread_scores) setScores(data.thread_scores);
          else if (data) setScores(data);
        }
      } catch (err) {
        console.error("Failed to pre-load:", err);
      } finally { setFetching(false); }
    };
    fetchExistingExpertData();
  }, []);

  const allSteps = useMemo(() => {
    return EXPERT_ASSESSMENT_FRAMEWORK.flatMap((comp) =>
      comp.threads.map((thread) => ({
        ...thread,
        parentCompetence: comp.name,
        area: comp.area,
        competenceDescription: comp.description,
      }))
    );
  }, []);

  // Center the active step in the scrollable container
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.children[stepIndex] as HTMLElement;
      if (activeElement) {
        scrollRef.current.scrollTo({
          left: activeElement.offsetLeft - scrollRef.current.offsetWidth / 2 + activeElement.offsetWidth / 2,
          behavior: "smooth"
        });
      }
    }
  }, [stepIndex]);

  const currentStep = allSteps[stepIndex];
  const progress = ((stepIndex + 1) / allSteps.length) * 100;
  const accentColor = AREA_COLORS[currentStep.area] || "#2563eb";
  const lightAccentColor = `${accentColor}1a`;

  // Milestone Logic
  const isEndOfCompetence = useMemo(() => {
    if (stepIndex === allSteps.length - 1) return false;
    return allSteps[stepIndex].parentCompetence !== allSteps[stepIndex + 1]?.parentCompetence;
  }, [stepIndex, allSteps]);

  const isEndOfArea = useMemo(() => {
    if (stepIndex === allSteps.length - 1) return true;
    return allSteps[stepIndex].area !== allSteps[stepIndex + 1]?.area;
  }, [stepIndex, allSteps]);

  // Chart Data: Scoped to the current Area
  const chartData = useMemo(() => {
    const currentAreaComps = EXPERT_ASSESSMENT_FRAMEWORK.filter(c => c.area === currentStep.area);
    return currentAreaComps.map(comp => {
      const threadIds = comp.threads.map(t => t.id);
      const avgScore = threadIds.reduce((a, b) => a + (scores[b] || 0), 0) / threadIds.length;
      return { subject: comp.name, value: avgScore, fullMark: 8 };
    });
  }, [currentStep.area, scores]);

  const handleNext = () => {
    if (isEndOfArea && !showAreaChart && (showCompSummary || !isEndOfCompetence)) {
      setShowAreaChart(true);
      setShowCompSummary(false);
      window.scrollTo(0, 0);
    } else if (isEndOfCompetence && !showCompSummary && !showAreaChart) {
      setShowCompSummary(true);
      window.scrollTo(0, 0);
    } else if (stepIndex < allSteps.length - 1) {
      setShowCompSummary(false);
      setShowAreaChart(false);
      setStepIndex(stepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      submitExpertAssessment();
    }
  };

  const submitExpertAssessment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/expert`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(scores),
      });
      if (!response.ok) throw new Error("Failed to save");
      router.push("/results/expert");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#fcfcfd] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* PROGRESS BAR & DOTS (Always visible) */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span style={{ color: accentColor }} className="font-black text-[10px] uppercase tracking-widest">
                {currentStep.area} Progress
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Step {stepIndex + 1} <span className="text-slate-300 font-medium">/ {allSteps.length}</span>
              </h2>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full">
               <span className="text-xs font-bold text-slate-500">{Math.round(progress)}% Complete</span>
            </div>
          </div>
          <div className="relative h-12 flex items-center">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
            <div ref={scrollRef} className="absolute inset-0 flex items-center gap-6 overflow-x-auto no-scrollbar px-4">
              {allSteps.map((step, idx) => {
                const isCompleted = !!scores[step.id];
                const isActive = stepIndex === idx;
                const areaColor = AREA_COLORS[step.area];
                return (
                  <button
                    key={step.id}
                    onClick={() => { setShowCompSummary(false); setShowAreaChart(false); setStepIndex(idx); }}
                    className={`relative z-10 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "scale-125 shadow-lg shadow-white" : "scale-100"}`}
                    style={{
                      backgroundColor: isCompleted || isActive ? areaColor : "#e2e8f0",
                      border: isActive ? `3px solid white` : 'none',
                      boxShadow: isActive ? `0 0 0 2px ${areaColor}` : 'none'
                    }}
                  >
                    {isCompleted ? (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400 opacity-50'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {showAreaChart ? (
          /* AREA CHART MILESTONE */
          <div className="bg-white rounded-3xl border-2 p-8 md:p-12 shadow-sm animate-in zoom-in-95 duration-500" style={{ borderColor: accentColor }}>
            <div className="text-center mb-10">
              <span style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Area Milestone Reached</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{currentStep.area}</h2>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 8]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="value" stroke={accentColor} fill={accentColor} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 flex justify-center">
              <button onClick={handleNext} className="px-12 py-4 text-white rounded-2xl font-bold shadow-xl transition-all" style={{ backgroundColor: accentColor }}>
                {stepIndex === allSteps.length - 1 ? "Finish Assessment" : "Start Next Area →"}
              </button>
            </div>
          </div>
        ) : showCompSummary ? (
          /* COMPETENCE SUMMARY REVIEW */
          <div className="bg-white rounded-3xl border-2 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ borderColor: accentColor }}>
            <div className="mb-8 text-center md:text-left">
              <span style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-widest block mb-1">Competence Summary</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{currentStep.parentCompetence}</h2>
            </div>
            <div className="space-y-3 mb-10">
              {allSteps.filter(s => s.parentCompetence === currentStep.parentCompetence).map((s) => (
                <div key={s.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic">"{s.levels[scores[s.id]]}"</p>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-lg border font-bold text-[10px] shrink-0" style={{ color: accentColor, borderColor: accentColor }}>
                    Lvl {scores[s.id]}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={handleNext} className="px-10 py-4 text-white rounded-2xl font-bold shadow-lg transition-all" style={{ backgroundColor: accentColor }}>
                {isEndOfArea ? "View Area Overview" : "Continue →"}
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD QUESTION VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl border shadow-sm sticky top-8 transition-colors duration-500" style={{ borderColor: accentColor }}>
                <span style={{ backgroundColor: lightAccentColor, color: accentColor }} className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-4">{currentStep.area}</span>
                <h3 className="text-lg font-black text-slate-900 mb-2">{currentStep.parentCompetence}</h3>
                <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: lightAccentColor }}>"{currentStep.competenceDescription}"</p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="mb-8">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Building Block</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{currentStep.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(currentStep.levels).map(Number).sort((a,b)=>a-b).map((lvl) => {
                  const isSelected = scores[currentStep.id] === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setScores({ ...scores, [currentStep.id]: lvl })}
                      className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-start h-full ${isSelected ? "shadow-md scale-[1.02]" : "border-white bg-white hover:border-slate-200 shadow-sm"}`}
                      style={isSelected ? { borderColor: accentColor, backgroundColor: lightAccentColor } : {}}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: isSelected ? accentColor : "#94a3b8" }}>Level {lvl}</span>
                      <p className={`text-xs leading-relaxed ${isSelected ? "font-semibold" : "text-slate-600"}`} style={isSelected ? { color: accentColor } : {}}>{currentStep.levels[lvl]}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 flex items-center justify-between gap-4">
                <button disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)} className="px-6 py-4 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-0 transition">← Back</button>
                <button disabled={!scores[currentStep.id] || loading} onClick={handleNext} className="flex-1 lg:flex-none px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-xl transition-all active:scale-95 disabled:bg-slate-200">
                  {loading ? "Saving..." : isEndOfArea ? "Review Area" : isEndOfCompetence ? "Review Competence" : stepIndex === allSteps.length - 1 ? "Complete Assessment" : "Next Building Block →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}