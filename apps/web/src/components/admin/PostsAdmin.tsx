import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { CreatePost, Post, UpdatePost } from '@monorepo/schemas';
import { SignOutButton } from '@clerk/astro/react';
import { ApiError } from '../../lib/apiClient';
import { createPost, deletePost, getPosts, updatePost } from '../../services/post.service';
import { PostForm } from './PostForm';
import { QueryProvider } from './QueryProvider';

type Mode = { kind: 'list' } | { kind: 'create' } | { kind: 'edit'; post: Post };

function Inner() {
	const qc = useQueryClient();
	const [mode, setMode] = useState<Mode>({ kind: 'list' });
	const [error, setError] = useState<string | null>(null);
	const handleError = (err: unknown) => setError(formatError(err));

	const postsQuery = useQuery({
		queryKey: ['posts'],
		queryFn: () => getPosts(),
		staleTime: 30_000,
		refetchOnWindowFocus: false,
	});

	const createMut = useMutation({
		mutationFn: (body: CreatePost) => createPost(body),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['posts'] });
			setMode({ kind: 'list' });
			setError(null);
		},
		onError: handleError,
	});

	const updateMut = useMutation({
		mutationFn: ({ id, body }: { id: string; body: UpdatePost }) => updatePost(id, body),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['posts'] });
			setMode({ kind: 'list' });
			setError(null);
		},
		onError: handleError,
	});

	const deleteMut = useMutation({
		mutationFn: (id: string) => deletePost(id),
		onSuccess: (_data, id) => {
			qc.setQueryData<Post[]>(['posts'], (prev) => prev?.filter((p) => p.id !== id));
		},
		onError: handleError,
	});

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2 style={{ margin: 0 }}>Posts</h2>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					{mode.kind !== 'list' && <button onClick={() => setMode({ kind: 'list' })}>Back</button>}
					{mode.kind === 'list' && (
						<button onClick={() => setMode({ kind: 'create' })}>New post</button>
					)}
					<SignOutButton redirectUrl="/sign-in">
						<button>Log out</button>
					</SignOutButton>
				</div>
			</header>

			{error && <div style={{ color: 'crimson' }}>{error}</div>}

			{mode.kind === 'create' && (
				<PostForm
					submitLabel="Create"
					onSubmit={async (body) => {
						await createMut.mutateAsync(body);
					}}
				/>
			)}

			{mode.kind === 'edit' && (
				<PostForm
					initial={mode.post}
					submitLabel="Save"
					onSubmit={async (body) => {
						await updateMut.mutateAsync({ id: mode.post.id, body });
					}}
				/>
			)}

			{mode.kind === 'list' && (
				<>
					{postsQuery.isLoading && <p>Loading…</p>}
					{postsQuery.isError && <p style={{ color: 'crimson' }}>Failed to load posts.</p>}
					{postsQuery.data && (
						<ul
							style={{
								listStyle: 'none',
								padding: 0,
								display: 'flex',
								flexDirection: 'column',
								gap: '0.5rem',
							}}
						>
							{postsQuery.data.map((post) => (
								<li
									key={post.id}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										borderBottom: '1px solid #eee',
										padding: '0.5rem 0',
									}}
								>
									<div>
										<strong>{post.title}</strong>{' '}
										<small style={{ color: '#888' }}>
											{post.slug} · {post.published ? 'published' : 'draft'}
										</small>
									</div>
									<div style={{ display: 'flex', gap: '0.5rem' }}>
										<button onClick={() => setMode({ kind: 'edit', post })}>Edit</button>
										<button
											onClick={() => {
												if (confirm(`Delete "${post.title}"?`)) deleteMut.mutate(post.id);
											}}
										>
											Delete
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</>
			)}
		</div>
	);
}

function formatError(err: unknown): string {
	if (err instanceof ApiError) {
		const body = typeof err.body === 'string' ? err.body : JSON.stringify(err.body);
		return body ? `${err.status}: ${body}` : `${err.status}`;
	}
	if (err instanceof Error) return err.message;
	return 'Unknown error';
}

export function PostsAdmin() {
	return (
		<QueryProvider>
			<Inner />
		</QueryProvider>
	);
}
