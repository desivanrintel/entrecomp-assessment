"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface HistoricAssessment {
  id: number;
  created_at: string;
  // We calculate an average to show a quick "score" in the list
  avg_score: number; 
}

export default function UserAssessmentHistory() {
  const { id } = useParams();
  const router = useRouter();
  const [history, setHistory] = useState<HistoricAssessment[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      try {
        const response = await fetch(`${API_URL}/api/admin/users/${id}/assessments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setHistory(data.assessments);
          setUserName(data.user_name);
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading history...</div>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4">
          ← Back to Users
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Assessment History</h1>
        <p className="text-gray-600">Viewing records for <span className="font-bold text-blue-600">{userName}</span></p>
      </header>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
            No assessments found for this user.
          </div>
        ) : (
          history.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Date Taken</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(record.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Overall Avg</p>
                <p className="text-xl font-black text-blue-600">{record.avg_score.toFixed(1)} / 8</p>
              </div>

              <button 
                onClick={() => router.push(`/results?user_id=${id}&assessment_id=${record.id}`)}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 transition"
              >
                View DNA Chart
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}