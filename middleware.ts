import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const protectedRoute = createRouteMatcher([
  '/',
  '/courses(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) {
    const { userId } = auth();
    const url = req.nextUrl.clone()
    url.pathname = '/landing'

    if (!userId) {
      return NextResponse.redirect(url);
    }

    auth().protect()
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
