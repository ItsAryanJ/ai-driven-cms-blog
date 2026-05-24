"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import DashboardTable from "@/components/admin/DashboardTable";
import Pagination from "@/components/ui/Pagination";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useAdminToast } from "@/app/admin/layout";
import { postsService } from "@/services/posts";
import type { PostListItem, PaginatedResponse } from "@/types";

function PostsContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("search") || "";

  const [postsData, setPostsData] = useState<PaginatedResponse<PostListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery);
  const [activeStatus, setActiveStatus] = useState(statusFilter);
  const { addToast } = useAdminToast();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postsService.getAdminPosts({
        page,
        page_size: 10,
        status: activeStatus || undefined,
        search: search || undefined,
        sort_by: "created_at",
        sort_order: "desc",
      });
      setPostsData(data);
    } catch {
      addToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [page, activeStatus, search, addToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await postsService.delete(id);
      addToast("Post deleted successfully", "success");
      fetchPosts();
    } catch {
      addToast("Failed to delete post", "error");
    }
  };

  const handleToggleStatus = async (id: number, newStatus: "draft" | "published") => {
    try {
      await postsService.update(id, { status: newStatus });
      addToast(`Post ${newStatus === "published" ? "published" : "unpublished"} successfully`, "success");
      fetchPosts();
    } catch {
      addToast("Failed to update post status", "error");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25 transition-all text-sm"
        >
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm transition-all"
          />
        </form>

        <div className="flex gap-2">
          {["", "draft", "published"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeStatus === status
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="row" />
      ) : (
        <>
          <DashboardTable
            posts={postsData?.items || []}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
          {postsData && (
            <Suspense fallback={null}>
              <Pagination
                currentPage={postsData.page}
                totalPages={postsData.total_pages}
                basePath="/admin/posts"
                preserveParams
              />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense fallback={<div className="p-8"><LoadingSkeleton count={5} type="row" /></div>}>
      <PostsContent />
    </Suspense>
  );
}
