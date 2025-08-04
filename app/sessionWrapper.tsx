import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import useAlert from "@/hooks/useAlert";
import { RefreshToken } from "@/services/auth";
import { GET_PROFILE } from "@/graphql/session/profile";
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
  const [animationDone, setAnimationDone] = useState<boolean>(false);
  const [triedUserData, setTriedUserData] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { handleSession, data } = useSessionStore();
  const { notifyError } = useAlert();

  const [Session, { error: authError, loading: authLoading }] =
    useLazyQuery(GET_PROFILE);

  const handleUserData = async () => {
    try {
      const { data: userData, error } = await Session();
      if (userData) {
        handleSession(userData.session);
        return true;
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
          const { data: refreshedData } = await Session();
          handleSession(refreshedData.session);
          return true;
        }
      }
      // If still not authenticated, redirect to auth page
      notifyError(
        "Error al intentar obtener los datos del usuario. Redirigiendo a la página de inicio de sesión."
      );
      router.replace("/auth");
      return false;
    } catch (error) {
      console.error(error, authError);
      notifyError("Sesión expirada. Redirigiendo...");
      router.replace("/auth");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If no token but refreshToken exists, try to refresh
    if (!token && refreshToken && animationDone) {
      (async () => {
        try {
          const refreshResponse = await RefreshToken();
          if (refreshResponse?.success) {
            window.location.href = pathname; // Reload the page to apply the new token
            return; // Prevent further execution
          }
        } catch (error) {
          console.error("Error al intentar renovar el token:", error);
        }
        setLoading(false);
        router.replace("/auth");
      })();
      return; // Prevent further execution
    }

    // If neither token nor refreshToken, redirect
    if (!token && !refreshToken && animationDone) {
      setLoading(false);
      router.replace("/auth");
      return;
    }

    // If token exists but no user data, fetch user (only once)
    if (token && !data.id && !triedUserData) {
      setTriedUserData(true);
      handleUserData();
    } else if (token && data.id) {
      setLoading(false);
    }
  }, [token, refreshToken, animationDone, data, triedUserData]);

  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!animationDone) setAnimationDone(true);
    }, 3000);
    return () => clearTimeout(fallback);
  }, []);

  if ((loading || authLoading) && pathname === "/") {
    return (
      <main className="w-full h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8, filter: "brightness(90%)" }}
            animate={{ scale: 1, opacity: 1, filter: "brightness(120%)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            onAnimationComplete={() => setAnimationDone(true)}
          >
            <Image
              src={"/branding/logo.webp"}
              alt="Logo EKORU"
              priority
              width={4096}
              height={2048}
              className="w-[40%] mx-auto"
            />
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
