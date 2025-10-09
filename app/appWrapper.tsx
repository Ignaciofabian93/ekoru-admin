import Providers from "./providers";
import { cookies } from "next/headers";

export default async function AppWrapper({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("x-o-token")?.value;
  const refreshToken = (await cookies()).get("x-o-refresh-token")?.value;

  return (
    <Providers token={token} refreshToken={refreshToken}>
      {children}
    </Providers>
  );
}
