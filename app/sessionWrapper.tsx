"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSessionStore from "@/store/session";
import { GetProfile, RefreshToken } from "@/services/auth";

export default function SessionWrapper({
  children,
  token,
  refreshToken,
}: {
  children: React.ReactNode;
  token: string | undefined;
  refreshToken: string | undefined;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { admin, setAdmin } = useSessionStore();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // If already logged in, skip
        if (admin) {
          setLoading(false);
          return;
        }
        // If no token but refreshToken exists, try to refresh
        if (!token && refreshToken) {
          const refresh = await RefreshToken();
          if (refresh?.success) {
            const refreshedProfile = await GetProfile();
            if (refreshedProfile && refreshedProfile.id && refreshedProfile.email) {
              setAdmin({
                id: refreshedProfile.id,
                email: refreshedProfile.email,
                name: refreshedProfile.name,
              });
              setLoading(false);
              return;
            }
          }
          setAdmin(null);
          router.replace("/auth");
          return;
        }
        // If neither token nor refreshToken, redirect
        if (!token && !refreshToken) {
          setAdmin(null);
          router.replace("/auth");
          return;
        }
        // If token exists, try to get profile
        if (token) {
          const profile = await GetProfile();
          if (profile && profile.id && profile.email) {
            setAdmin({ id: profile.id, email: profile.email, name: profile.name });
            setLoading(false);
            return;
          } else {
            // Try to refresh token if profile fetch fails
            if (refreshToken) {
              const refresh = await RefreshToken();
              if (refresh?.success) {
                const refreshedProfile = await GetProfile();
                if (refreshedProfile && refreshedProfile.id && refreshedProfile.email) {
                  setAdmin({ id: refreshedProfile.id, email: refreshedProfile.email, name: profile.name });
                  setLoading(false);
                  return;
                }
              }
            }
            setAdmin(null);
            router.replace("/auth");
            return;
          }
        }
      } catch {
        setAdmin(null);
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
