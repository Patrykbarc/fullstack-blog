import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import type { CreatePost, Post } from '@monorepo/schemas';

const formSchema = z.object({
	title: z.string().trim().min(1, 'Title is required').max(120),
	slug: z.string().trim().max(140).optional().or(z.literal('')),
	description: z.string().trim().min(1, 'Description is required').max(300),
	content: z.string().trim().min(1, 'Content is required'),
	heroImage: z.string().url('Must be a URL').optional().or(z.literal('')),
	tagsInput: z.string().default(''),
	published: z.boolean().default(false),
	pubDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
	initial?: Post;
	submitLabel: string;
	onSubmit: (data: CreatePost) => Promise<void> | void;
};

export function PostForm({ initial, submitLabel, onSubmit }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initial
			? {
					title: initial.title,
					slug: initial.slug,
					description: initial.description,
					content: initial.content,
					heroImage: initial.heroImage ?? '',
					tagsInput: initial.tags.join(', '),
					published: initial.published,
					pubDate: toLocalInput(initial.pubDate),
				}
			: {
					title: '',
					slug: '',
					description: '',
					content: '',
					heroImage: '',
					tagsInput: '',
					published: false,
					pubDate: '',
				},
	});

	const submit: SubmitHandler<FormValues> = async (values) => {
		const payload: CreatePost = {
			title: values.title,
			slug: values.slug ? values.slug : undefined,
			description: values.description,
			content: values.content,
			heroImage: values.heroImage ? values.heroImage : undefined,
			tags: values.tagsInput
				.split(',')
				.map((t: string) => t.trim())
				.filter(Boolean),
			published: values.published,
			pubDate: values.pubDate ? new Date(values.pubDate) : undefined,
		};
		await onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit(submit)} style={formStyle}>
			<label style={fieldStyle}>
				Title
				<input type="text" {...register('title')} />
				<FieldError msg={errors.title?.message} />
			</label>

			<label style={fieldStyle}>
				Slug <small>(optional — generated from title)</small>
				<input type="text" {...register('slug')} />
				<FieldError msg={errors.slug?.message} />
			</label>

			<label style={fieldStyle}>
				Description
				<input type="text" {...register('description')} />
				<FieldError msg={errors.description?.message} />
			</label>

			<label style={fieldStyle}>
				Content (markdown)
				<textarea rows={10} {...register('content')} />
				<FieldError msg={errors.content?.message} />
			</label>

			<label style={fieldStyle}>
				Hero image URL (optional)
				<input type="url" {...register('heroImage')} />
				<FieldError msg={errors.heroImage?.message} />
			</label>

			<label style={fieldStyle}>
				Tags (comma-separated)
				<input type="text" {...register('tagsInput')} />
			</label>

			<label style={fieldStyle}>
				Publish date (optional)
				<input type="datetime-local" {...register('pubDate')} />
			</label>

			<label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
				<input type="checkbox" {...register('published')} />
				Published
			</label>

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Saving…' : submitLabel}
			</button>
		</form>
	);
}

function FieldError({ msg }: { msg?: string }) {
	if (!msg) return null;
	return <span style={{ color: 'crimson', fontSize: '0.85rem' }}>{msg}</span>;
}

function toLocalInput(d: Date): string {
	const pad = (n: number) => `${n}`.padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const formStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '1rem',
	maxWidth: '720px',
};

const fieldStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '0.25rem',
};
