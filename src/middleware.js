import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return req.cookies.get(name)?.value },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.delete({ name, value, ...options });
        },
      },
    }
  );

  // Utilise getUser() mais seulement si on n'est pas sur une page statique
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

  if (!user && isDashboardPage) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  // Cette ligne est CRUCIALE pour éviter le timeout 504
  // Elle empêche le middleware de s'exécuter sur les images, fonts, etc.
  matcher: [
    '/dashboard/:path*', 
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};