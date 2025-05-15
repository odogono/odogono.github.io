import { getCollection } from 'astro:content';
import { slug as githubSlug } from 'github-slugger';

import { createLog } from '@helpers/log';
import type { PostEntry, PostSummary } from '@types';

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

export const getPostsSummary = (posts: PostEntry[]): PostSummary[] =>
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

type TagSummary = {
  count: number;
  href: string;
  tag: string;
};

export const getTagsSummaries = (posts: PostEntry[]): TagSummary[] => {
  const tags = posts.flatMap(post => post.data.tags ?? []);

  const tagsCount = tags.reduce(
    (acc, tag) => {
      acc[tag] = acc[tag] || 0;
      acc[tag]++;
      return acc;
    },
    {} as Record<string, number>
  );

  const tagsSorted = Object.entries(tagsCount).sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase())
  );

  log.debug('[getTagsSummaries] tags', posts.length, tagsSorted);

  return tagsSorted.map(([tag, count]) => ({
    count,
    href: `/tags/${tag}/`,
    tag
  }));

  // return tags.map(tag => {
  //   const posts = posts.filter(post => post.data.tags?.includes(tag));

  //   return {
  //     heroImage: posts[0].data.heroImage || '/posts/placeholder-1.jpg',
  //     href: `/tags/${tag}/`,
  //     pubDate: posts[0].data.pubDate,
  //     title: tag
  //   };
  // });
};
