"use client"; // Required because we are using React hooks (useState/useEffect)

import { useEffect, useState } from "react";

export default function Home() {
  // 1. Create a state variable to hold our API data
  const [data, setData] = useState({ message: "Connecting to backend..." });

  // 2. Fetch data when the component mounts
  useEffect(() => {
  // It automatically picks the right URL based on where it's running!
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  fetch(`${baseUrl}/api/hello`)
    .then((res) => res.json())
    .then((data) => setData(data));
}, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="p-10 bg-gray-800 rounded-xl shadow-2xl border border-blue-500">
        <h1 className="text-2xl font-mono mb-4 text-blue-400">Backend Response:</h1>
        <p className="text-4xl font-bold italic">"{data.message}"</p>
      </div>
    </main>
  );
}