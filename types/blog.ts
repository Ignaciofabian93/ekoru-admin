import { BlogCategory } from "./enums";

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  email: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  specialties: BlogCategory[];
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: BlogCategory;
  author: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  };
};

export interface BlogCategoryInfo {
  category: BlogCategory;
  name: string;
  description: string;
  color: string;
  icon?: string;
  postsCount: number;
}

export interface BlogStats {
  totalPosts: number;
  totalAuthors: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  mostPopularCategory: BlogCategory;
  recentPosts: BlogPost[];
}

export interface BlogFilters {
  category?: BlogCategory;
  tags?: string[];
  author?: string;
  search?: string;
  sortBy?: "newest" | "oldest" | "popular" | "mostViewed";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BlogListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
  filters?: BlogFilters;
}

export type BlogCategories = {
  id: number;
  name: string;
  icon: string;
  description?: string;
  blogs?: BlogPost[];
};
