"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import TagBadge from "@/components/blog/TagBadge";
import CategoryBadge from "@/components/blog/CategoryBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { postsService } from "@/services/posts";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await postsService.getBySlug(slug);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <LoadingSkeleton type="text" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
        <p className="text-gray-400 mb-6">{error || "The post you're looking for doesn't exist."}</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        {post.category && (
          <div className="mb-4">
            <CategoryBadge category={post.category} />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

        {post.excerpt && (
          <p className="text-lg text-gray-400 leading-relaxed mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b border-white/10">
          <span>{post.author.email}</span>
          <span>•</span>
          <time>{post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}</time>
        </div>
      </header>

      {/* Content */}
      <div className="mb-8">
        <MarkdownRenderer content={post.body} />
      </div>

      {/* Footer */}
      {post.tags.length > 0 && (
        <footer className="pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} size="md" />
            ))}
          </div>
        </footer>
      )}

      {/* Back */}
      <div className="mt-10">
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}
