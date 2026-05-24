export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryWithCount extends Category {
  post_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface TagWithCount extends Tag {
  post_count: number;
}

export interface PostAuthor {
  id: number;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  status: "draft" | "published";
  author: PostAuthor;
  category: Category | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published";
  author: PostAuthor;
  category: Category | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_categories: number;
  total_tags: number;
}

export interface PostCreateData {
  title: string;
  excerpt?: string;
  body: string;
  category_id?: number | null;
  tag_ids: number[];
  status: "draft" | "published";
}

export interface PostUpdateData {
  title?: string;
  excerpt?: string;
  body?: string;
  category_id?: number | null;
  tag_ids?: number[];
  status?: "draft" | "published";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiError {
  detail: string;
}
