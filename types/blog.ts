import { Admin } from "./user";

export type BlogCategory = {
  id: number;
  name: string;
  icon?: string | null;
  description?: string | null;
  posts?: BlogPost[];
};

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  blogCategory: BlogCategory;
  author: Admin;
};

export type CommunityPost = {
  id: number;
  sellerId: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CommunityComment = {
  id: number;
  communityPostId: number;
  sellerId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CommunityCategory = {
  id: number;
  category: string;
};

export type CommunitySubCategory = {
  id: number;
  subCategory: string;
  communityCategoryId: number;
};
