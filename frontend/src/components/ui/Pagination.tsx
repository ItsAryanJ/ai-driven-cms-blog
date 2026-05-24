"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  preserveParams?: boolean;
}

export default function Pagination({ currentPage, totalPages, basePath, preserveParams = false }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    if (preserveParams) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      return `${pathname}?${params.toString()}`;
    }
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          ← Previous
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              page === currentPage
                ? "bg-violet-600 text-white font-medium shadow-lg shadow-violet-600/25"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
