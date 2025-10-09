"use client";
import { useQuery, ApolloError } from "@apollo/client";
import { getTableQuery } from "@/graphql/database/queryGenerator";

interface UseTableDataProps {
  tableName: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

interface UseTableDataReturn {
  data: Record<string, unknown>[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  totalCount?: number;
}

/**
 * Custom hook to fetch data for any database table
 * Uses the query generator to dynamically create GraphQL queries
 */
export const useTableData = ({
  tableName,
  limit = 10,
  offset = 0,
  filters = {},
}: UseTableDataProps): UseTableDataReturn => {
  const query = getTableQuery(tableName);
  const queryName = `get${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`;
  console.log("Using query:", query);
  console.log("Query name:", queryName);

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      limit,
      offset,
      ...filters,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Extract the data from the query result
  const tableData = data?.[queryName] || [];

  return {
    data: tableData,
    loading,
    error,
    refetch,
    totalCount: tableData.length, // You might want to add a separate count query
  };
};
