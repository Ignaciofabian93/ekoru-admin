import { gql } from "@apollo/client";

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title
      content
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
      author {
        id
        name
        lastName
        email
      }
    }
  }
`;

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: ID!, $input: UpdateBlogPostInput!) {
    updateBlogPost(id: $id, input: $input) {
      id
      title
      content
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
      author {
        id
        name
        lastName
        email
      }
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
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
      author {
        id
        name
        lastName
        email
      }
    }
  }
`;

export const UNPUBLISH_BLOG_POST = gql`
  mutation UnpublishBlogPost($id: ID!) {
    unpublishBlogPost(id: $id) {
      id
      title
      content
      isPublished
      publishedAt
      createdAt
      updatedAt
      category
      author {
        id
        name
        lastName
        email
      }
    }
  }
`;
