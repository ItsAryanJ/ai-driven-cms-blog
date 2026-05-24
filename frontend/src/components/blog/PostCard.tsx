import Link from "next/link";
import type { PostListItem } from "@/types";
import { formatDate, truncate } from "@/lib/utils";
import TagBadge from "./TagBadge";
import CategoryBadge from "./CategoryBadge";

interface PostCardProps {
  post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-300">
      <div className="p-6">
        {post.category && (
          <div className="mb-3">
            <CategoryBadge category={post.category} />
          </div>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {truncate(post.excerpt, 180)}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-xs text-gray-500">
            {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
