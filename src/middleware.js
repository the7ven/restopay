import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  let res = NextResponse.next();

  // Initialisation du client Supabase spécifique au Middleware
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

  // On récupère la session actuelle
  const { data: { session } } = await supabase.auth.getSession();

  // --- LOGIQUE DE REDIRECTION ---
  
  // 1. Si l'utilisateur n'est pas connecté et essaie d'aller sur le dashboard
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // 2. Si l'utilisateur est DÉJÀ connecté et essaie d'aller sur login/signup
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

// On définit sur quelles routes le middleware doit s'activer
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};