"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/ui/Pagination";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { postsService } from "@/services/posts";
import type { PostListItem, PaginatedResponse } from "@/types";

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const page = Number(searchParams.get("page")) || 1;

  const [postsData, setPostsData] = useState<PaginatedResponse<PostListItem> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postsService.getPublished({ page, page_size: 9, category: slug });
        setPostsData(data);
      } catch {
        setPostsData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [slug, page]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-sm text-fuchsia-400 font-medium mb-2">Category</p>
        <h1 className="text-3xl font-bold text-white capitalize">{slug.replace(/-/g, " ")}</h1>
        <p className="text-gray-400 mt-2">{postsData?.total || 0} posts in this category</p>
      </div>

      {postsData && postsData.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination currentPage={postsData.page} totalPages={postsData.total_pages} basePath={`/category/${slug}`} />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10">
          <p className="text-gray-500">No posts in this category</p>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 py-12"><LoadingSkeleton count={6} /></div>}>
      <CategoryContent />
    </Suspense>
  );
}
