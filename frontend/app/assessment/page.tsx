"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENTRECOMP_STEPS } from "@/app/lib/constants";

// Helper to get descriptive text for the 1-8 scale
const getLevelInfo = (value: number) => {
  if (value <= 2) return { label: "Foundation", color: "text-gray-400", desc: "Under direct supervision." };
  if (value <= 4) return { label: "Intermediate", color: "text-blue-500", desc: "With increasing independence." };
  if (value <= 6) return { label: "Advanced", color: "text-indigo-600", desc: "Taking responsibility." };
  return { label: "Expert", color: "text-purple-600", desc: "Contributing to the field." };
};

export default function AssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(ENTRECOMP_STEPS.flatMap(s => s.fields.map(f => [f.key, 1])))
  );

  const currentData = ENTRECOMP_STEPS[step];

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Animated Progress Header */}
        <div className="mb-10 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Step {step + 1} of 3
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">
                {currentData.area}
            </h2>
            <div className="mt-6 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 transition-all duration-700 ease-out"
                    style={{ width: `${((step + 1) / 3) * 100}%` }}
                />
            </div>
        </div>

        {/* Assessment Cards */}
        <div className="space-y-6">
          {currentData.fields.map((field) => {
            const level = getLevelInfo(scores[field.key]);
            return (
              <div key={field.key} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{field.label}</h3>
                  <div className={`text-right ${level.color}`}>
                    <span className="text-2xl font-black">{scores[field.key]}</span>
                    <p className="text-[10px] font-bold uppercase tracking-tighter leading-none">{level.label}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  {field.description}
                </p>

                {/* Styled Range Slider */}
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={scores[field.key]}
                    onChange={(e) => setScores({ ...scores, [field.key]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-3 px-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <span key={n} className={`text-[10px] font-bold ${scores[field.key] === n ? 'text-blue-600' : 'text-slate-300'}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="mt-4 text-center text-xs italic text-slate-400">
                  "{level.desc}"
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 disabled:opacity-0 transition"
          >
            ← Previous
          </button>
          
          <button
            onClick={() => {
              if (step < 2) setStep(step + 1);
              else console.log("Submit logic here", scores); // Call your submit function
            }}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            {step === 2 ? "Generate DNA Profile" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}