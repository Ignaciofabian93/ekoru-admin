import { GET_ADMINS } from "@/graphql/admins/queries";
import { Admin } from "@/types/user";
import { useQuery } from "@apollo/client";

interface UseAdminsParams {
  adminType?: "PLATFORM" | "BUSINESS";
  isActive?: boolean;
  role?: string;
  sellerId?: string; // For business admins to filter by their seller
  limit?: number;
  offset?: number;
}

export default function useAdmins(params?: UseAdminsParams) {
  const { data, loading, error, refetch } = useQuery(GET_ADMINS, {
    variables: {
      adminType: params?.adminType,
      isActive: params?.isActive ?? true,
      role: params?.role,
      limit: params?.limit ?? 50,
      offset: params?.offset ?? 0,
    },
    skip: !params?.adminType, // Skip query if adminType is not provided
  });

  return {
    admins: (data?.getAdmins as Admin[]) || [],
    loading,
    error,
    refetch,
  };
}
