"use client";

import { useRouter } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { useAdminToast } from "@/app/admin/layout";
import { postsService } from "@/services/posts";
import type { PostCreateData, PostUpdateData } from "@/types";

export default function NewPostPage() {
  const router = useRouter();
  const { addToast } = useAdminToast();

  const handleSubmit = async (
    data: PostCreateData | PostUpdateData
  ) => {
    try {
      await postsService.create(data as PostCreateData);

      addToast("Post created successfully!", "success");
      router.push("/admin/posts");
    } catch (err) {
      addToast(
        err instanceof Error
          ? err.message
          : "Failed to create post",
        "error"
      );
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Create New Post
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Write and publish a new blog post
        </p>
      </div>

      <PostEditor onSubmit={handleSubmit} />
    </div>
  );
}