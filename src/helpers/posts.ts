import { getCollection } from 'astro:content';
import { slug as githubSlug } from 'github-slugger';

import { createLog } from '@helpers/log';
import type {
  DateEntry,
  Entry,
  NoteEntry,
  NotesPageEntry,
  PostEntry,
  PostSummary,
  TagSummary
} from '@types';

import { isSameDay } from './date';

const log = createLog('helpers/posts');

export const isPostEntry = (entry: Entry): entry is PostEntry =>
  'data' in entry && !!entry.data.isPost;

export const isNoteEntry = (entry: Entry): entry is NoteEntry =>
  'data' in entry && !!entry.data.isNote;

export const isDateEntry = (entry: object): entry is DateEntry =>
  'date' in entry;

export const getNotes = async (): Promise<NoteEntry[]> => {
  const notes: NoteEntry[] = await getCollection('notes');
  return notes.map(note => {
    note.data.isNote = true;
    note.url = getEntryUrl(note);
    return note;
  });
};

export const getPosts = async (): Promise<PostEntry[]> => {
  const posts: PostEntry[] = await getCollection('posts');
  return posts.map(post => {
    post.data.isPost = true;
    post.url = getEntryUrl(post);
    return post;
  });
};

export const getPublishedNotes = async (): Promise<NoteEntry[]> =>
  (await getNotes()).filter(note => !note.data.isDraft);

/**
 * Get published posts
 *
 * the includeNotes flag is neccesary because posts can
 * also be tagged as being notes
 *
 * @param includeNotes - include notes in the result
 * @returns published posts
 */
export const getPublishedPosts = async (
  includeNotes = false
): Promise<PostEntry[]> =>
  (await getPosts())
    .filter(post => !post.data.isDraft)
    .filter(post => {
      if (post.data.isNote && !includeNotes) {
        return false;
      }

      return true;
    });

export const sortEntriesByDate = (entries: Entry[]): Entry[] =>
  entries.toSorted(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

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
    const { data } = post;

    const { description, heroImage, pubDate, tags, title } = data;

    const url = getEntryUrl(post);

    return {
      description,
      heroImage: heroImage || '/posts/placeholder-1.jpg',
      pubDate,
      tags,
      title,
      url
    };
  });

export const getPostSlug = (post: Entry) => {
  const { data, id } = post;
  const { pubDate, slug, title } = data;

  if (slug) {
    return slug;
  }

  if (isNoteEntry(post)) {
    const year = pubDate.getFullYear();
    const month = pubDate.getMonth() + 1;
    const day = pubDate.getDate();

    return `${year}/${month}/${day}/${githubSlug(title ?? id)}`;
  }

  return githubSlug(title ?? id);
};

export const getEntryUrl = (entry: Entry) => {
  const slug = getPostSlug(entry);

  if (isNoteEntry(entry)) {
    return `/blog/${slug}/`;
  }

  return `/posts/${slug}/`;
};

export const getTagsSummaries = async (): Promise<TagSummary[]> => {
  const entries = await getPublishedContent(true);

  const tags = entries.flatMap(entry => entry.data.tags ?? []);

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

  // log.debug('[getTagsSummaries] tags', posts.length, tagsSorted);

  return tagsSorted.map(([tag, count]) => ({
    count,
    href: `/tags/${tag}/`,
    tag
  }));
};

export const getPostsTags = async (): Promise<string[]> => {
  const entries = await getPublishedContent(true);

  const tags = entries.flatMap(entry => entry.data.tags ?? []);
  return [...new Set(tags)];
};

export const filterEntriesByTag = (entries: Entry[], tag: string): Entry[] =>
  entries.filter(entry => entry.data.tags?.includes(tag));

export const getNoteUrl = (note: NoteEntry) => {
  const { pubDate, title } = note.data;

  const year = pubDate.getFullYear();
  const month = pubDate.getMonth() + 1;
  const day = pubDate.getDate();

  return `${year}/${month}/${day}/${title ?? 'unknown'}`;
};

export const getPublishedContent = async (
  sortByDate = true
): Promise<Entry[]> => {
  const notes = await getPublishedNotes();
  const posts = await getPublishedPosts(true);

  const entries = [...notes, ...posts];

  if (sortByDate) {
    return sortEntriesByDate(entries);
  }

  return entries;
};

/**
 * Returns an array of Entry interleaved with a date header
 * suitable for display
 *
 * @returns
 */
export const applyDateEntries = (entries: Entry[]): NotesPageEntry[] => {
  const [, pageEntries] = entries.reduce<[Date, NotesPageEntry[]]>(
    ([currentDate, acc], note) => {
      const date = note.data.pubDate;

      if (!isSameDay(date, currentDate)) {
        acc.push({ date: date.toISOString() });
      }

      acc.push(note);

      return [date, acc];
    },
    [new Date(0), [] as NotesPageEntry[]]
  );

  return pageEntries;
};

export const getNotesPaths = async () => {
  const notes = await getPublishedNotes();

  const sortedNotes = sortEntriesByDate(notes);

  return sortedNotes.map(note => ({
    params: { slug: getPostSlug(note) },
    props: note
  }));
};
