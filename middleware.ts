import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/', '/login', '/signup', '/planos', '/termos', '/privacidade', '/lgpd', '/contato', '/ajuda', '/recuperar-senha'];

// Rotas que precisam de autenticação
const protectedRoutes = ['/dashboard', '/quiz'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Se for rota protegida, verificar autenticação
  if (isProtectedRoute) {
    // Como estamos usando localStorage, não podemos verificar no middleware
    // O middleware roda no servidor, então vamos deixar a verificação no cliente
    // Apenas retornamos next() aqui
    return NextResponse.next();
  }

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
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|icon.svg).*)',
  ],
};
