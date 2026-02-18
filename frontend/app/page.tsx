"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if a token exists to change the UI for returning users
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Master Your <span className="text-blue-600">Entrepreneurial</span> Skills
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          The EntreComp framework helps you identify your strengths and areas for growth 
          across 15 key competencies. Start your assessment today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={isLoggedIn ? "/assessment" : "/login"} 
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            {isLoggedIn ? "Continue Assessment" : "Start Assessment"}
          </Link>
          
          {!isLoggedIn && (
            <Link 
              href="/login" 
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}