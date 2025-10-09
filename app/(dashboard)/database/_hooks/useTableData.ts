import { useState, useEffect, useCallback } from "react";

interface UseTableDataProps {
  tableName: string;
  enabled: boolean;
}

interface TableData {
  data: Record<string, unknown>[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching table data
 * TODO: Implement GraphQL queries for each table type
 *
 * This hook will:
 * 1. Accept a table name
 * 2. Build the appropriate GraphQL query
 * 3. Fetch data from the API
 * 4. Handle loading and error states
 * 5. Provide refetch functionality
 */
export function useTableData({ tableName, enabled }: UseTableDataProps): TableData {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual GraphQL query
      // Example:
      // const query = buildQueryForTable(tableName);
      // const response = await apolloClient.query({ query });
      // setData(response.data);

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Placeholder data
      setData([
        { id: 1, name: `Sample ${tableName} 1` },
        { id: 2, name: `Sample ${tableName} 2` },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [tableName, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Helper function to build GraphQL queries based on table name
 * TODO: Implement specific queries for each table type
 */
export function buildQueryForTable(tableName: string): string {
  // This will map table names to their GraphQL queries
  const queryMap: Record<string, string> = {
    Admin: `
      query GetAdmins {
        admins {
          id
          email
          name
          lastName
          role
          isActive
        }
      }
    `,
    Product: `
      query GetProducts {
        products {
          id
          name
          description
          price
          stock
          isActive
        }
      }
    `,
    // Add more table queries here
  };

  return queryMap[tableName] || "";
}
