"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
// Assuming you moved the data to this path
import { EXPERT_ASSESSMENT_FRAMEWORK, AREA_COLORS } from "@/app/lib/expert-framework";

export default function ExpertAssessmentPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

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
  const accentColor = AREA_COLORS[currentStep.area] || "#2563eb"; // Fallback to blue
  const lightAccentColor = `${accentColor}1a`;
  
  // Identify available levels for this specific thread (handling 1-7 or 1-8)
  const availableLevels = Object.keys(currentStep.levels)
    .map(Number)
    .sort((a, b) => a - b);

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
    // Submit logic will go here
    console.log("Final Expert Scores:", scores);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Navigation */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span style={{ color: accentColor }} className="text-blue-600 font-bold text-sm tracking-widest uppercase">
                Expert Assessment
              </span>
              <h2 className="text-xl font-bold text-slate-400">
                Step {stepIndex + 1} <span className="text-slate-300">/ {allSteps.length}</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-900">{Math.round(progress)}% Complete</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Context Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-8" style={{ border: `1px solid ${accentColor}` }}>
              <div className="mb-4">
                <span style={{ backgroundColor: lightAccentColor, color: accentColor }} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {currentStep.area}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">{currentStep.parentCompetence}</h3>
              <h4 className="text-m font-black text-slate-500 mb-1">{currentStep.competenceHint}</h4>
              <p className="text-sm text-slate-500 leading-relaxed italic">
                "{currentStep.competenceDescription}"
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">AI Node Ready</p>
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 border-dashed">
                  <p className="text-[11px] text-indigo-500 italic">
                    AI feedback hooks are ready for this thread.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Thread Selection */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {availableLevels.map((lvl) => {
                const isSelected = scores[currentStep.id] === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setScores({ ...scores, [currentStep.id]: lvl })}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group ${
                      isSelected ? "shadow-md" : "border-white bg-white hover:border-slate-200"
                    }`}
                    style={isSelected ? { 
                      borderColor: accentColor, 
                      backgroundColor: lightAccentColor 
                    } : {}}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span 
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: isSelected ? accentColor : "#94a3b8" }}
                      >
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
                    <p className={`text-sm leading-relaxed ${isSelected ? "font-medium" : "text-slate-600"}`}
                       style={isSelected ? { color: accentColor } : {}}>
                      {currentStep.levels[lvl]}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                disabled={stepIndex === 0}
                onClick={() => setStepIndex(stepIndex - 1)}
                className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-0 transition"
              >
                ← Previous Thread
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