"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
// Ensure these paths match your project structure
import { EXPERT_ASSESSMENT_FRAMEWORK, AREA_COLORS } from "@/app/lib/expert-framework";

export default function ExpertAssessmentPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- 1. DEVELOPMENT PRE-FILL LOGIC ---
  // This initializes scores with Level 4 for all threads if DEV_MODE is true
  // --- DEVELOPMENT PRE-FILL LOGIC ---
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const DEV_MODE = true; // Set to false for production
    if (!DEV_MODE) return {};

    const preFilled: Record<string, number> = {};
    EXPERT_ASSESSMENT_FRAMEWORK.forEach(comp => {
      comp.threads.forEach(thread => {
        // Get the available levels (e.g., [1, 2, 3, 4, 5, 6, 7, 8])
        const levels = Object.keys(thread.levels).map(Number);
        
        // Pick one at random from the list
        const randomIndex = Math.floor(Math.random() * levels.length);
        preFilled[thread.id] = levels[randomIndex];
      });
    });
    return preFilled;
  });

  // --- 2. DATA ORCHESTRATION ---
  // Flatten the framework so every thread is a standalone step
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

  // --- 3. HANDLERS ---
  const handleNext = () => {
    if (stepIndex < allSteps.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      submitExpertAssessment();
    }
  };

  const jumpToLastStep = () => {
    const newScores = { ...scores };
    allSteps.forEach((step, index) => {
      if (index < allSteps.length - 1 && !newScores[step.id]) {
        newScores[step.id] = 4; 
      }
    });
    setScores(newScores);
    setStepIndex(allSteps.length - 1);
    window.scrollTo(0, 0);
  };

  const submitExpertAssessment = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Use the exact same variable and structure as your detailed assessment
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

  // --- 4. RENDER ---
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
            <button 
              onClick={jumpToLastStep}
              className="mb-1 text-[10px] font-bold bg-amber-100 text-amber-600 px-3 py-1 rounded-full border border-amber-200 hover:bg-amber-200 transition-colors"
            >
              DEV: Jump to End ⚡
            </button>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Context Sidebar */}
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

          {/* Right Column: Interactive Area */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                Building Block
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {currentStep.title}
              </h2>
            </div>

            {/* 2-COLUMN GRID FOR LEVELS */}
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
                      {isSelected && (
                        <div style={{ backgroundColor: accentColor }} className="w-5 h-5 rounded-full flex items-center justify-center">
                           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                           </svg>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isSelected ? "font-semibold" : "text-slate-600"}`} style={isSelected ? { color: accentColor } : {}}>
                      {currentStep.levels[lvl]}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Navigation Navigation */}
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