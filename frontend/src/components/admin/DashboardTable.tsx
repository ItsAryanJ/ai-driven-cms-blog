"use client";

import Link from "next/link";
import type { PostListItem } from "@/types";
import { formatDateShort } from "@/lib/utils";

interface DashboardTableProps {
  posts: PostListItem[];
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, newStatus: "draft" | "published") => void;
}

export default function DashboardTable({ posts, onDelete, onToggleStatus }: DashboardTableProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/10">
        <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p className="text-gray-500 text-sm">No posts found</p>
        <Link
          href="/admin/posts/new"
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Updated</th>
              <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-sm text-white hover:text-violet-400 font-medium transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400">{post.category?.name || "—"}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{formatDateShort(post.created_at)}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{formatDateShort(post.updated_at)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        onToggleStatus(post.id, post.status === "published" ? "draft" : "published")
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        post.status === "published"
                          ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
