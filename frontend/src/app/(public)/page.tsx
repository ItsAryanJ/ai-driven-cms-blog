"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/ui/Pagination";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { postsService } from "@/services/posts";
import { categoriesService } from "@/services/categories";
import { tagsService } from "@/services/tags";
import type { PostListItem, PaginatedResponse, CategoryWithCount, TagWithCount } from "@/types";
import Link from "next/link";

function HomeContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [postsData, setPostsData] = useState<PaginatedResponse<PostListItem> | null>(null);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [posts, cats, tgs] = await Promise.all([
          postsService.getPublished({ page, page_size: 9 }),
          categoriesService.getAll(),
          tagsService.getAll(),
        ]);
        setPostsData(posts);
        setCategories(cats);
        setTags(tgs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              BlogCMS
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore ideas, stories, and insights crafted with care. A modern platform for modern content.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {postsData && postsData.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {postsData.items.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                <Suspense fallback={null}>
                  <Pagination
                    currentPage={postsData.page}
                    totalPages={postsData.total_pages}
                    basePath="/"
                  />
                </Suspense>
              </>
            ) : (
              <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-gray-500">No published posts yet</p>
                <p className="text-gray-600 text-sm mt-1">Check back soon for new content</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between text-sm text-gray-400 hover:text-violet-400 transition-colors py-1"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">{cat.post_count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 text-xs transition-all"
                    >
                      # {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 py-12"><LoadingSkeleton count={6} /></div>}>
      <HomeContent />
    </Suspense>
  );
}
