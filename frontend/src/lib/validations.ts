import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title must be under 300 characters"),
  excerpt: z.string().max(500, "Excerpt must be under 500 characters").optional().or(z.literal("")),
  body: z.string().min(1, "Content is required"),
  category_id: z.number().nullable().optional(),
  tag_ids: z.array(z.number()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type TagFormData = z.infer<typeof tagSchema>;
