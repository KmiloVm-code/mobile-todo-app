import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Define route patterns
      const publicRoutes = ["/login", "/register"];
      const isOnPublicPage = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Root redirect logic
      if (pathname === "/") {
        const redirectUrl = isLoggedIn ? "/dashboard" : "/login";
        return Response.redirect(new URL(redirectUrl, nextUrl));
      }

      // Redirect authenticated users away from public pages
      if (isLoggedIn && isOnPublicPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Block unauthenticated users from protected pages
      return isLoggedIn || isOnPublicPage;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.image;
      }

      // Handle session updates
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },

    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  providers: [],
} satisfies NextAuthConfig;
