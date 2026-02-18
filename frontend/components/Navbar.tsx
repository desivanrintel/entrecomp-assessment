"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, [pathname]); // Re-run check when route changes

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Hide Navbar on the Home page (/) and Login page (/login)
  if (pathname === "/" || pathname === "/login" || !isLoggedIn) {
    return null;
  }

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <div className="flex gap-8 items-center">
        <span className="font-black text-xl tracking-tighter text-blue-400">ENTRECOMP</span>
        
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/dashboard" className={`hover:text-blue-300 ${pathname === '/dashboard' ? 'text-blue-400' : ''}`}>
            Dashboard
          </Link>
          
          {role === "admin" && (
            <Link href="/admin" className={`hover:text-blue-300 ${pathname === '/admin' ? 'text-blue-400' : ''}`}>
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="text-xs bg-gray-800 hover:bg-red-900 px-4 py-2 rounded transition border border-gray-700"
      >
        Sign Out
      </button>
    </nav>
  );
}