import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Sesión cerrada" },
    {
      status: 200,
    }
  );
  response.headers.append("Set-Cookie", "token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
  response.headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict"
  );
  return response;
}
