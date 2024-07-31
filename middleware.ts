<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';

export async function middleware(request: any) {
  const path = request.nextUrl.pathname;

  // Skip authentication for login and signup pages
  if (path === '/login' || path === '/signup') {
    return NextResponse.next();
  }

  const auth = getAuth(app);
  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => resolve(user));
  });

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
=======
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoute = createRouteMatcher([
  '/',
  '/study(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
>>>>>>> f85170efa4a39146ff29629d997c2a300a13cf0f
};