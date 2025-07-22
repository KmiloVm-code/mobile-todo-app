import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      // Define route patterns
      const publicRoutes = ['/login', '/register']
      const isOnPublicPage = publicRoutes.some((route) =>
        pathname.startsWith(route)
      )

      // Root redirect logic
      if (pathname === '/' || pathname === '/dashboard') {
        if (isLoggedIn) {
          if (
            pathname === '/dashboard' &&
            !nextUrl.searchParams.has('filter')
          ) {
            return Response.redirect(
              new URL('/dashboard?filter=all&page=1', nextUrl)
            )
          }
        } else {
          return Response.redirect(new URL('/login', nextUrl))
        }
      }

      // Redirect authenticated users away from public pages
      if (isLoggedIn && isOnPublicPage) {
        return Response.redirect(new URL('/dashboard?filter=all', nextUrl))
      }

      // Block unauthenticated users from protected pages
      return isLoggedIn || isOnPublicPage
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.avatar = user.image
      }

      // Handle session updates
      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }

      return token
    },

    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  providers: [],
} satisfies NextAuthConfig
