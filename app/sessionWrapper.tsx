/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RefreshToken } from "./api/auth/auth";
import { Loader2 } from "lucide-react";
import { useLazyQuery } from "@apollo/client";
import { GET_MY_DATA } from "@/graphql/session/queries";
import useSessionStore from "@/store/session";

export default function SessionWrapper({
  children,
  token,
  refreshToken,
}: {
  children: React.ReactNode;
  token: string | undefined;
  refreshToken: string | undefined;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [userFetched, setUserFetched] = useState<boolean>(false);
  const pathname = usePathname();
  const { handleSession } = useSessionStore();

  const [getMyData, { loading: userLoading }] = useLazyQuery(GET_MY_DATA);

  useEffect(() => {
    // If both tokens are missing, assume guest user
    if (!token && !refreshToken) {
      setLoading(false);
      return;
    }

    // If token is missing but refreshToken exists, try to refresh
    if (!token && refreshToken) {
      (async () => {
        try {
          const refreshResponse = await RefreshToken();
          if (refreshResponse?.success) {
            window.location.href = pathname; // Reload the page to apply the new token
            return;
          }
        } catch (error) {
          console.error("Error al intentar renovar el token:", error);
        }
        setLoading(false);
      })();
      return;
    }

    // If token exists, fetch user data (only once)
    if (token && !userFetched) {
      setUserFetched(true);
      // Uncomment and adjust below to fetch user data
      (async () => {
        try {
          const { data: userData, error } = await getMyData();
          if (userData) {
            handleSession(userData.getMyData);
            setLoading(false);
            return;
          }
          // If 401, try refresh
          if (
            error &&
            error.networkError &&
            "statusCode" in error.networkError &&
            error.networkError.statusCode === 401
          ) {
            const refreshResponse = await RefreshToken();
            if (refreshResponse?.success) {
              const { data: refreshedData } = await getMyData();
              handleSession(refreshedData.getMyData);
              setLoading(false);
              return;
            }
          }
          // If still not authenticated, assume guest
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      })();
      // For now, just simulate fetch
      setTimeout(() => setLoading(false), 500);
      return;
    }
    // If token exists and user already fetched
    if (token && userFetched) {
      setLoading(false);
      return;
    }
  }, [token, refreshToken, userFetched, pathname]);

  // Optionally show loading spinner
  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  // Optionally pass guest state to children via context or props
  return <>{children}</>;
}
