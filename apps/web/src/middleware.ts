import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {
	if (isProtectedRoute(context.request) && !auth().userId) {
		const signInUrl = new URL('/sign-in', context.request.url);
		signInUrl.searchParams.set('redirect_url', context.request.url);
		return context.redirect(signInUrl.toString());
	}
});
