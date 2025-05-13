import { getCollection } from 'astro:content';

import rss from '@astrojs/rss';

import { SITE_DESCRIPTION, SITE_TITLE } from '../constants';

export const GET = async context => {
  const posts = await getCollection('blog');
  return rss({
    description: SITE_DESCRIPTION,
    items: posts.map(post => ({
      ...post.data,
      link: `/blog/${post.id}/`
    })),
    site: context.site,
    title: SITE_TITLE
  });
};
