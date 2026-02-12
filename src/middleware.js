import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return req.cookies.get(name)?.value },
        set(name, value, options) {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value, ...options });
        },
      },
    }
  );

  // CHANGEMENT CRUCIAL : Utilisez getUser() au lieu de getSession()
  // getUser() est plus sûr et évite les problèmes de timeout de session sur Vercel
  const { data: { user } } = await supabase.auth.getUser();

  // --- LOGIQUE DE REDIRECTION ---
  
  // 1. Si pas connecté -> redirection login
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // 2. Si déjà connecté -> redirection dashboard
  if (user && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  // On affine le matcher pour éviter les fichiers statiques
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};