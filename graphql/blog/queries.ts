import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($offset: Int, $limit: Int, $isPublished: Boolean, $category: BlogCategory) {
    getBlogPosts(offset: $offset, limit: $limit, isPublished: $isPublished, category: $category) {
      id
      title
      content
      authorId
      tags
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;

export const GET_BLOG_POST = gql`
  query GetBlogPost($id: ID!) {
    getBlogPost(id: $id) {
      id
      title
      content
      authorId
      tags
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;

export const GET_BLOG_POSTS_BY_AUTHOR = gql`
  query GetBlogPostsByAuthor($authorId: ID!, $offset: Int, $limit: Int) {
    getBlogPostsByAuthor(authorId: $authorId, offset: $offset, limit: $limit) {
      id
      title
      content
      authorId
      tags
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;
