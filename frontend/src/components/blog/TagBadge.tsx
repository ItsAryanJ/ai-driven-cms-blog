import Link from "next/link";
import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Tag;
  size?: "sm" | "md";
}

export default function TagBadge({ tag, size = "sm" }: TagBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <Link
      href={`/tag/${tag.slug}`}
      className={`inline-flex items-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 hover:border-violet-500/30 transition-all ${sizeClasses}`}
    >
      # {tag.name}
    </Link>
  );
}
