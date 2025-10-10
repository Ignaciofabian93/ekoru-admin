import useSessionStore from "@/store/session";

export default function useAdminType() {
  const { data } = useSessionStore();

  const PLATFORM_ADMIN = "PLATFORM";

  const isPlatformAdmin = data.adminType === PLATFORM_ADMIN;

  return { isPlatformAdmin };
}
