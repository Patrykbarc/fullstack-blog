import { useState } from 'react';

export function LoginForm() {
	const [apiKey, setApiKey] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ apiKey }),
			});
			if (res.ok) {
				window.location.href = '/admin';
				return;
			}
			const body = (await res.json().catch(() => ({}))) as { error?: string };
			setError(body.error ?? `Login failed (${res.status})`);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={onSubmit}
			style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' }}
		>
			<label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
				API key
				<input
					type="password"
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
					autoFocus
					required
				/>
			</label>
			{error && <div style={{ color: 'crimson' }}>{error}</div>}
			<button type="submit" disabled={loading}>
				{loading ? 'Verifying…' : 'Log in'}
			</button>
		</form>
	);
}
