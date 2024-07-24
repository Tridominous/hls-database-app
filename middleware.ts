

import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/',  // Protecting the home page
  '/add-equipment(.*)',
  '/collection(.*)',
  '/community(.*)',
  '/tags(.*)',
  '/profile(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/api/webhook(.*)',
  '/api/uploadthing(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // Allow public access to these routes
  }
  
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/add-equipment',
    '/collection',
    '/community',
    '/tags',
    '/profile',
    '/api/webhook(.*)',
    '/api/uploadthing(.*)',
  ],
};