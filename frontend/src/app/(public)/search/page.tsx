"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { postsService } from "@/services/posts";
import type { PostListItem, PaginatedResponse } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [postsData, setPostsData] = useState<PaginatedResponse<PostListItem> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await postsService.search({ q: query, page, page_size: 9 });
        setPostsData(data);
      } catch {
        setPostsData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, page]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
        <SearchBar defaultValue={query} className="max-w-xl" />
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : query && postsData ? (
        <>
          <p className="text-gray-400 mb-6">
            {postsData.total} result{postsData.total !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
          {postsData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsData.items.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <Suspense fallback={null}>
                <Pagination currentPage={postsData.page} totalPages={postsData.total_pages} basePath="/search" preserveParams />
              </Suspense>
            </>
          ) : (
            <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500">No results found for &quot;{query}&quot;</p>
              <p className="text-gray-600 text-sm mt-1">Try different keywords</p>
            </div>
          )}
        </>
      ) : (
        !query && (
          <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500">Enter a search term to find posts</p>
          </div>
        )
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 py-12"><LoadingSkeleton count={6} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
