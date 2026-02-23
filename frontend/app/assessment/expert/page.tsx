"use client";

import { useState, useMemo, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";
import { EXPERT_ASSESSMENT_FRAMEWORK, AREA_COLORS } from "@/app/lib/expert-framework";

export default function ExpertAssessmentPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Added to track initial data load

  // --- 1. STATE INITIALIZATION ---
  const [scores, setScores] = useState<Record<string, number>>({});

  // --- 2. DATA PRE-LOADING LOGIC ---
  useEffect(() => {
    const fetchExistingExpertData = async () => {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (!token) {
        setFetching(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/assessments/expert/latest`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.ok) {
          const data = await response.json();
          // If data exists, it should contain thread_scores or a flat record of IDs
          if (data && data.thread_scores) {
            setScores(data.thread_scores);
          } else if (data) {
            setScores(data);
          }
        }
      } catch (err) {
        console.error("Failed to pre-load expert assessment:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchExistingExpertData();
  }, []);

  // --- 3. DATA ORCHESTRATION ---
  const allSteps = useMemo(() => {
    return EXPERT_ASSESSMENT_FRAMEWORK.flatMap((comp) =>
      comp.threads.map((thread) => ({
        ...thread,
        parentCompetence: comp.name,
        area: comp.area,
        competenceDescription: comp.description,
        competenceHint: comp.hint
      }))
    );
  }, []);

  const currentStep = allSteps[stepIndex];
  const progress = ((stepIndex + 1) / allSteps.length) * 100;
  const accentColor = AREA_COLORS[currentStep.area] || "#2563eb"; 
  const lightAccentColor = `${accentColor}1a`;
  
  const availableLevels = Object.keys(currentStep.levels)
    .map(Number)
    .sort((a, b) => a - b);

  // --- 4. HANDLERS ---
  const handleNext = () => {
    if (stepIndex < allSteps.length - 1) {
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${API_URL}/api/assessments/expert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(scores),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save");
      }

      router.push("/results/expert");
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering the form until we know if there is existing data to pre-load
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="text-center animate-pulse">
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Resuming Matrix Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfd] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span style={{ color: accentColor }} className="font-bold text-sm tracking-widest uppercase">
                Expert Assessment
              </span>
              <h2 className="text-xl font-bold text-slate-400">
                Step {stepIndex + 1} <span className="text-slate-300">/ {allSteps.length}</span>
              </h2>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar and interactive areas remain the same... */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-3xl border shadow-sm sticky top-8" style={{ borderColor: accentColor }}>
              <span style={{ backgroundColor: lightAccentColor, color: accentColor }} className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-4">
                {currentStep.area}
              </span>
              <h3 className="text-lg font-black text-slate-900 mb-2">{currentStep.parentCompetence}</h3>
              <h4 className="text-sm font-bold text-slate-500 mb-3">{currentStep.competenceHint}</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: lightAccentColor }}>
                "{currentStep.competenceDescription}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="mb-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                Building Block
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {currentStep.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableLevels.map((lvl) => {
                const isSelected = scores[currentStep.id] === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setScores({ ...scores, [currentStep.id]: lvl })}
                    className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-full ${
                      isSelected ? "shadow-md scale-[1.02]" : "border-white bg-white hover:border-slate-200 shadow-sm"
                    }`}
                    style={isSelected ? { borderColor: accentColor, backgroundColor: lightAccentColor } : {}}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: isSelected ? accentColor : "#94a3b8" }}>
                        Level {lvl}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isSelected ? "font-semibold" : "text-slate-600"}`} style={isSelected ? { color: accentColor } : {}}>
                      {currentStep.levels[lvl]}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                disabled={stepIndex === 0}
                onClick={() => setStepIndex(stepIndex - 1)}
                className="px-6 py-4 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-0 transition"
              >
                ← Back
              </button>
              
              <button
                disabled={!scores[currentStep.id] || loading}
                onClick={handleNext}
                className="flex-1 lg:flex-none px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-xl transition-all active:scale-95 disabled:bg-slate-200"
              >
                {loading ? "Saving..." : stepIndex === allSteps.length - 1 ? "Complete Assessment" : "Next Building Block →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}