import Link from "next/link";
import type { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="inline-flex items-center px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 hover:border-fuchsia-500/30 transition-all text-xs font-medium"
    >
      {category.name}
    </Link>
  );
}
