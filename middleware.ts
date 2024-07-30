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
};