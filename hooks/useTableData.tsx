"use client";
import { useQuery, ApolloError } from "@apollo/client";
import { getTableQuery } from "@/graphql/database/queryGenerator";

interface UseTableDataProps {
  tableName: string;
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface UseTableDataReturn {
  data: Record<string, unknown>[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  totalCount: number;
  pageInfo: PageInfo | undefined;
}

/**
 * Custom hook to fetch data for any database table
 * Uses the query generator to dynamically create GraphQL queries
 * All tables use page-based pagination with pageInfo and nodes structure
 */
export const useTableData = ({
  tableName,
  page = 1,
  pageSize = 10,
  filters = {},
}: UseTableDataProps): UseTableDataReturn => {
  const query = getTableQuery(tableName);
  const queryName = `get${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`;
  console.log("Executing query for table:", tableName, query);

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      page,
      pageSize,
      ...filters,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Extract the data from the query result
  const tableData: Record<string, unknown>[] = data?.[queryName]?.nodes || [];
  const pageInfo: PageInfo | undefined = data?.[queryName]?.pageInfo;

  return {
    data: tableData,
    loading,
    error,
    refetch,
    totalCount: pageInfo?.totalCount || 0,
    pageInfo,
  };
};
