import { getCollection } from 'astro:content';
import { slug as githubSlug } from 'github-slugger';

import { createLog } from '@helpers/log';
import type { BlogEntry } from '@types';

const log = createLog('helpers/posts');

export const getPublishedPosts = async (): Promise<BlogEntry[]> => {
  const posts: BlogEntry[] = await getCollection('blog');
  return posts.filter(post => !post.data.isDraft);
};

export const sortPostsByDate = (posts: BlogEntry[]): BlogEntry[] =>
  posts.toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

export const getPostsTags = (posts: BlogEntry[]): string[] => {
  const tags = posts.flatMap(post => post.data.tags ?? []);
  return [...new Set(tags)];
};

export const getPublishedPostsPaths = async () => {
  const posts = await getPublishedPosts();

  return posts.map(post => ({
    params: { slug: getPostSlug(post) },
    props: post
  }));
};

// export const getUniquePostsTags = (posts: BlogEntry[]): string[] =>
// [...new Set(getPostsTags(posts))];

export const getPostsSummary = (posts: BlogEntry[]) =>
  posts.map(post => {
    const postSlug = getPostSlug(post);

    const { data, id } = post;

    const { heroImage, pubDate, slug, title } = data;

    const href = `/posts/${postSlug}/`;

    return {
      heroImage: heroImage || '/src/content/posts/blog-placeholder-1.jpg',
      href,
      pubDate,
      title
    };
  });

export const getPostSlug = (post: BlogEntry) => {
  const { data, id } = post;
  const { slug, title } = data;

  if (slug) {
    return slug;
  }

  return githubSlug(title);
};
