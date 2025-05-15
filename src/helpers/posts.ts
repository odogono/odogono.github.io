import { getCollection } from 'astro:content';
import { slug as githubSlug } from 'github-slugger';

import { createLog } from '@helpers/log';
import type { PostEntry } from '@types';

const log = createLog('helpers/posts');

export const getPublishedPosts = async (): Promise<PostEntry[]> => {
  const posts: PostEntry[] = await getCollection('posts');
  return posts.filter(post => !post.data.isDraft);
};

export const sortPostsByDate = (posts: PostEntry[]): PostEntry[] =>
  posts.toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

export const getPostsTags = (posts: PostEntry[]): string[] => {
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

// export const getUniquePostsTags = (posts: PostEntry[]): string[] =>
// [...new Set(getPostsTags(posts))];

export const getPostsSummary = (posts: PostEntry[]) =>
  posts.map(post => {
    const postSlug = getPostSlug(post);

    const { data, id } = post;

    const { heroImage, pubDate, slug, title } = data;

    const href = `/posts/${postSlug}/`;

    return {
      heroImage: heroImage || '/posts/placeholder-1.jpg',
      href,
      pubDate,
      title
    };
  });

export const getPostSlug = (post: PostEntry) => {
  const { data, id } = post;
  const { slug, title } = data;

  if (slug) {
    return slug;
  }

  return githubSlug(title);
};
