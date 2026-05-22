import axios, { AxiosError } from 'axios';
import { getEnvs } from '../constants/env.generated';

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly body: unknown,
	) {
		super(`API request failed with status ${status}`);
		this.name = 'ApiError';
	}
}

export const apiClient = axios.create({
	baseURL: getEnvs().API_URL,
	headers: { accept: 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
	if (typeof window === 'undefined') return config;
	const { getToken } = await import('@clerk/astro/client');
	const token = await getToken();
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

apiClient.interceptors.response.use(
	(res) => res,
	(err: unknown) => {
		if (err instanceof AxiosError && err.response) {
			return Promise.reject(new ApiError(err.response.status, err.response.data));
		}
		return Promise.reject(err);
	},
);
