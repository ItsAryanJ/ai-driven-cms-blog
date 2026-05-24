"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a12]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              B
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Blog<span className="text-violet-400">CMS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/search")
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Search
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-64">
              <SearchBar placeholder="Search..." />
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
