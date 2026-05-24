"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { CategoryWithCount, TagWithCount, PostCreateData, PostUpdateData, Post } from "@/types";
import { categoriesService } from "@/services/categories";
import { tagsService } from "@/services/tags";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface PostEditorProps {
  initialData?: Post;
  onSubmit: (data: PostCreateData | PostUpdateData) => Promise<void>;
  isEditing?: boolean;
}

export default function PostEditor({ initialData, onSubmit, isEditing = false }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.category?.id || null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialData?.tags?.map((t) => t.id) || []);
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "draft");
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tgs] = await Promise.all([categoriesService.getAll(), tagsService.getAll()]);
        setCategories(cats);
        setTags(tgs);
      } catch (err) {
        console.error("Failed to load categories/tags:", err);
      }
    };
    fetchData();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (title.length > 300) newErrors.title = "Title must be under 300 characters";
    if (!body.trim()) newErrors.body = "Content is required";
    if (excerpt && excerpt.length > 500) newErrors.excerpt = "Excerpt must be under 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (submitStatus?: "draft" | "published") => {
    const finalStatus = submitStatus || status;
    if (!validate()) return;

    setLoading(true);
    try {
      const data: PostCreateData = {
        title,
        excerpt: excerpt || undefined,
        body,
        category_id: categoryId,
        tag_ids: selectedTagIds,
        status: finalStatus,
      };
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-lg"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description of your post..."
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
        />
        {errors.excerpt && <p className="mt-1 text-sm text-red-400">{errors.excerpt}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
        >
          <option value="" className="bg-[#1e1e2e]">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id} className="bg-[#1e1e2e]">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedTagIds.includes(tag.id)
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-violet-500/30 hover:text-white"
              }`}
            >
              {tag.name}
            </button>
          ))}
          {tags.length === 0 && <span className="text-sm text-gray-500">No tags available. Create tags first.</span>}
        </div>
      </div>

      {/* Body - Markdown Editor */}
      <div data-color-mode="dark">
        <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
        <MDEditor
          value={body}
          onChange={(val) => setBody(val || "")}
          height={500}
          preview="live"
        />
        {errors.body && <p className="mt-1 text-sm text-red-400">{errors.body}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <button
          onClick={() => handleSubmit("draft")}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-medium transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Save as Draft" : "Save Draft"}
        </button>
        <button
          onClick={() => handleSubmit("published")}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25 transition-all disabled:opacity-50"
        >
          {loading ? "Publishing..." : isEditing ? "Update & Publish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
