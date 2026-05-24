import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a12]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Blog<span className="text-violet-400">CMS</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              A modern self-hosted blog platform built with Next.js and FastAPI.
              Craft beautiful stories with our powerful markdown editor.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-violet-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-violet-400 text-sm transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-violet-400 text-sm transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technology</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Next.js 14+ (App Router)</li>
              <li>FastAPI + SQLAlchemy</li>
              <li>PostgreSQL</li>
              <li>TailwindCSS</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BlogCMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
