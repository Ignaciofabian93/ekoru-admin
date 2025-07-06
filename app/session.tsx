import { cookies } from "next/headers";
import SessionWrapper from "./sessionWrapper";

export default async function Session({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("token")?.value;
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  return (
    <SessionWrapper token={token} refreshToken={refreshToken}>
      {children}
    </SessionWrapper>
  );
}
