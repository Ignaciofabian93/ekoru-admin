import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($pageSize: Int, $page: Int, $isPublished: Boolean, $blogType: BlogType) {
    getBlogPosts(pageSize: $pageSize, page: $page, isPublished: $isPublished, blogType: $blogType) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
        totalPages
        currentPage
        pageSize
      }
      nodes {
        id
        title
        content
        authorId
        isPublished
        publishedAt
        createdAt
        updatedAt
        blogCategory {
          id
          name
          icon
          description
        }
        author {
          id
          email
          name
          lastName
        }
      }
    }
  }
`;

export const GET_BLOG_POST = gql`
  query GetBlogPost($id: ID!) {
    getBlogPost(id: $id) {
      id
      title
      content
      isPublished
      publishedAt
      createdAt
      updatedAt
      blogCategory {
        id
        name
        icon
        description
      }
      author {
        id
        name
        lastName
        email
      }
    }
  }
`;

export const GET_BLOG_POSTS_BY_AUTHOR = gql`
  query GetBlogPostsByAuthor($authorId: ID!, $offset: Int, $limit: Int) {
    getBlogPostsByAuthor(authorId: $authorId, offset: $offset, limit: $limit) {
      id
      title
      content
      isPublished
      publishedAt
      createdAt
      updatedAt
      blogCategory {
        id
        name
        icon
        description
      }
      author {
        id
        name
        lastName
        email
      }
    }
  }
`;

export const GET_BLOG_CATEGORIES = gql`
  query GetBlogCategories {
    getBlogCategories {
      id
      name
      description
      icon
    }
  }
`;
