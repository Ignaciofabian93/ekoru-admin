import { useLazyQuery } from "@apollo/client";
import { GET_USER_CATEGORIES, GET_USERS } from "@/graphql/users/users";
import { User, UserCategory } from "@/types/user";

export default function useUsers() {
  const [Users, { data: usersData, error: usersError, loading: usersLoading }] =
    useLazyQuery(GET_USERS);
  const [
    UserCategories,
    {
      data: userCategoriesData,
      error: userCategoriesError,
      loading: userCategoriesLoading,
    },
  ] = useLazyQuery(GET_USER_CATEGORIES);

  return {
    Users,
    UserCategories,
    users: (usersData?.users as User[]) || [],
    userCategories:
      (userCategoriesData?.userCategories as UserCategory[]) || [],
    usersLoading,
    userCategoriesLoading,
  };
}
