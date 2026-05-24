"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useAdminToast } from "@/app/admin/layout";
import { postsService } from "@/services/posts";
import type { Post, PostUpdateData } from "@/types";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useAdminToast();
  const postId = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsService.getById(postId);
        setPost(data);
      } catch {
        addToast("Failed to load post", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, addToast]);

  const handleSubmit = async (data: PostUpdateData) => {
    try {
      await postsService.update(postId, data);
      addToast("Post updated successfully!", "success");
      router.push("/admin/posts");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to update post", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <LoadingSkeleton type="text" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Post not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
        <p className="text-gray-400 text-sm mt-1">Update your blog post</p>
      </div>

      <PostEditor initialData={post} onSubmit={handleSubmit} isEditing />
    </div>
  );
}
