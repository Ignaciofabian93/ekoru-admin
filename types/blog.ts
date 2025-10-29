import { type BlogType, type BlogReactionType } from "./enums";

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  blogType: BlogType;
  categoryId: number;
  tags: string[];
  coverImage?: string | null;
  slug?: string | null;
  readTime?: number | null;
  viewCount: number;
  author: {
    id: string;
    name: string;
    lastName?: string | null;
    email: string;
  };
};

export type BlogReaction = {
  id: number;
  blogPostId: number;
  sellerId: string;
  reactionType: BlogReactionType;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogCategory = {
  id: number;
  category: string;
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
