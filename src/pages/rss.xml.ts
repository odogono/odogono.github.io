import rss from '@astrojs/rss';
import { getPublishedContent } from '@helpers/posts';

import { SITE_DESCRIPTION, SITE_TITLE } from '../constants';

export const GET = async context => {
  const posts = await getPublishedContent(true);

  return rss({
    description: SITE_DESCRIPTION,
    items: posts.map(post => ({
      ...post.data,
      link: post.url
    })),
    site: context.site,
    title: SITE_TITLE
  });
};
