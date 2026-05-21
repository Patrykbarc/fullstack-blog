export const ADMIN_COOKIE = 'admin_api_key';

export const ADMIN_COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: 'lax',
	path: '/',
	secure: import.meta.env.PROD,
	maxAge: 60 * 60 * 24 * 7,
} as const;
