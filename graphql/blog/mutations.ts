import { gql } from "@apollo/client";

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title
      content
      authorId
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: ID!, $input: UpdateBlogPostInput!) {
    updateBlogPost(id: $id, input: $input) {
      id
      title
      content
      authorId
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id)
  }
`;

export const PUBLISH_BLOG_POST = gql`
  mutation PublishBlogPost($id: ID!) {
    publishBlogPost(id: $id) {
      id
      title
      content
      authorId
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;

export const UNPUBLISH_BLOG_POST = gql`
  mutation UnpublishBlogPost($id: ID!) {
    unpublishBlogPost(id: $id) {
      id
      title
      content
      authorId
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
    }
  }
`;
