import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../constants/consts';
import { getPosts } from '../services/post.service';

export const prerender = false;

export async function GET(context) {
	const posts = await getPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts
			.filter((p) => p.published)
			.map((post) => ({
				title: post.title,
				description: post.description,
				pubDate: post.pubDate,
				link: `/blog/${post.slug}/`,
			})),
	});
}
