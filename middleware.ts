import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoute = createRouteMatcher([
  '/(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) {
    console.log('Protecting route:', req.url);
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};