"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { postsService } from "@/services/posts";
import type { DashboardStats, PostListItem, PaginatedResponse } from "@/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, postsData] = await Promise.all([
          postsService.getDashboard(),
          postsService.getAdminPosts({ page: 1, page_size: 5, sort_by: "created_at", sort_order: "desc" }),
        ]);
        setStats(statsData);
        setRecentPosts(postsData.items);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton count={4} type="row" />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: "Total Posts", value: stats.total_posts, color: "from-violet-500 to-violet-600", icon: "📝" },
        { label: "Published", value: stats.published_posts, color: "from-emerald-500 to-emerald-600", icon: "✅" },
        { label: "Drafts", value: stats.draft_posts, color: "from-amber-500 to-amber-600", icon: "📋" },
        { label: "Categories", value: stats.total_categories, color: "from-fuchsia-500 to-fuchsia-600", icon: "📂" },
        { label: "Tags", value: stats.total_tags, color: "from-blue-500 to-blue-600", icon: "🏷️" },
      ]
    : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your blog</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25 transition-all text-sm"
        >
          + New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium group-hover:text-violet-400 transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{post.category?.name || "Uncategorized"}</p>
                </div>
                <span
                  className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {post.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm py-4 text-center">No posts yet. Create your first post!</p>
        )}
      </div>
    </div>
  );
}
