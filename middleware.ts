import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si está en la página raíz, redirigir a login, si ya esta logueado redirigir al dashboard
  if (pathname === '/') {
    // Aquí podrías verificar si el usuario ya está autenticado
    // Por ejemplo, comprobando un token en las cookies o en el almacenamiento local
    const isAuthenticated = request.cookies.get('authToken'); // Cambia 'authToken' por el nombre real de tu cookie de autenticación

    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }


  // Aquí puedes agregar más lógica de protección de rutas en el futuro
  // Por ejemplo, proteger rutas del dashboard si no hay token de autenticación
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)',
  ],
};
