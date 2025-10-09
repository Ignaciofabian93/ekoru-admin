"use client";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import "@/lib/apolloSetup";
import { GRAPHQL_URL } from "@/config/endpoints";
import SessionWrapper from "./sessionWrapper";
import { ThemeProvider } from "@/providers/theme";

export default function Providers({
  children,
  token,
  refreshToken,
}: {
  children: React.ReactNode;
  token: string | undefined;
  refreshToken: string | undefined;
}) {
  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
    credentials: "include", // This ensures cookies are sent with every request
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    devtools: { enabled: true },
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ApolloProvider client={client}>
        <SessionWrapper token={token} refreshToken={refreshToken}>
          {children}
        </SessionWrapper>
      </ApolloProvider>
    </ThemeProvider>
  );
}
