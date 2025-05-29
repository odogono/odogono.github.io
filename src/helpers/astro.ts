import { getCollection } from 'astro:content';

import { createLog } from '@helpers/log';
import { slugify } from '@helpers/string';
import type {
  DateEntry,
  Entry,
  EntryTypes,
  NoteEntry,
  NotesPageEntry,
  PostEntry,
  PostSummary,
  ProjectEntry,
  ProjectSummary,
  Tag,
  TagSummary
} from '@types';

import { isDate, isSameDay } from './date';

const isDev = import.meta.env.DEV;

const log = createLog('helpers/astro');

export const isPostEntry = (entry: Entry): entry is PostEntry =>
  entry.collection === 'posts' || entry.data?.isPost === true;

export const isNoteEntry = (entry: Entry): entry is NoteEntry =>
  entry.collection === 'notes' || entry.data?.isNote === true;

export const isProjectEntry = (entry: Entry): entry is ProjectEntry =>
  entry.collection === 'projects' || entry.data?.isProject === true;

export const isDateEntry = (entry: object): entry is DateEntry =>
  'date' in entry;

export const getEntries = async (collection: EntryTypes): Promise<Entry[]> => {
  const entries: Entry[] = await getCollection(collection);
  return entries
    .map(entry => {
      entry.url = getEntryUrl(entry);
      return entry;
    })
    .map(entry => applyDraftTag(entry));
};

export const getNotes = async (): Promise<NoteEntry[]> =>
  (await getEntries('notes')) as NoteEntry[];

export const getPosts = async (): Promise<PostEntry[]> =>
  (await getEntries('posts')) as PostEntry[];

export const getProjects = async (): Promise<ProjectEntry[]> =>
  (await getEntries('projects')) as ProjectEntry[];

export const getAllEntries = async (): Promise<Entry[]> => {
  const notes = (await getEntries('notes')) as NoteEntry[];
  const posts = (await getEntries('posts')) as PostEntry[];

  return [...notes, ...posts];
};

export const applyDraftTag = (entry: Entry): Entry => {
  if (!isDev) {
    return entry;
  }

  if (!entry.data.isDraft) {
    return entry;
  }

  // if the entry already has a draft tag, don't add another one
  if (entry.data.tags?.some(tag => tag.slug === 'draft')) {
    return entry;
  }

  // otherwise, add a draft tag
  return {
    ...entry,
    data: {
      ...entry.data,
      tags: [...(entry.data.tags || []), { slug: 'draft', title: 'draft' }]
    }
  } as Entry;
};

export const filterPublishedEntries = <T extends Entry>(entries: T[]): T[] =>
  entries.filter(entry => (isDev ? true : !entry.data.isDraft));

export const getPublishedNotes = async (): Promise<NoteEntry[]> =>
  getNotes().then(notes => filterPublishedEntries(notes));

export const getPublishedProjects = async (): Promise<ProjectEntry[]> =>
  getProjects().then(projects => filterPublishedEntries(projects));

export const getCollectionFromEntry = (entry: Entry) => {
  if (isNoteEntry(entry)) {
    return 'notes';
  }
  if (isPostEntry(entry)) {
    return 'posts';
  }
  throw new Error('Invalid entry');
};

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
  getPosts()
    .then(posts => filterPublishedEntries(posts))
    .then(posts =>
      posts.filter(post => {
        if (post.data.isNote && !includeNotes) {
          return false;
        }

        return true;
      })
    );

export const sortEntriesByDate = <T extends Entry>(entries: T[]): T[] =>
  entries.toSorted(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

const isDateArray = (dates: unknown[] | undefined): dates is Date[] =>
  dates !== undefined &&
  Array.isArray(dates) &&
  dates.length > 0 &&
  dates.every(date => isDate(date));

export const sortEntriesByProjectDates = <T extends ProjectEntry>(
  entries: T[]
): T[] =>
  entries.toSorted((a, b) => {
    const aDates = a.data.projectDates;
    const bDates = b.data.projectDates;

    if (!isDateArray(aDates) || !isDateArray(bDates)) {
      return 0;
    }

    const aStart = aDates[0];
    const aEnd = aDates.at(-1);
    const bStart = bDates[0];
    const bEnd = bDates.at(-1);

    const adate = aEnd ?? aStart;
    const bdate = bEnd ?? bStart;

    return bdate.valueOf() - adate.valueOf();
  });

export const getPublishedPostsPaths = async () => {
  const posts = await getPublishedPosts();

  return posts.map(post => ({
    params: { slug: getPostSlug(post) },
    props: post
  }));
};

export const getPublishedProjectsPaths = async () => {
  const projects = await getPublishedProjects();

  return projects.map(project => ({
    params: { slug: getPostSlug(project) },
    props: project
  }));
};

export const getProjectsSummary = (
  projects: ProjectEntry[]
): ProjectSummary[] =>
  projects.map(project => {
    const { data, url } = project;
    const { description, heroImage, projectDates, pubDate, tags, title } = data;
    return {
      description,
      heroImage: heroImage || '/posts/placeholder-1.jpg',
      projectDates,
      pubDate,
      tags,
      title,
      url
    };
  });

export const getPostsSummary = (posts: PostEntry[]): PostSummary[] =>
  posts.map(post => {
    const { data, url } = post;
    const { description, heroImage, isDraft, pubDate, tags, title } = data;

    return {
      description,
      heroImage: heroImage || '/posts/placeholder-1.jpg',
      isDraft: isDraft ?? false,
      pubDate,
      tags,
      title,
      url
    };
  });

export const getPostSlug = (post: Entry) => {
  const { data, id } = post;
  const { pubDate, slug, title } = data;

  if (isNoteEntry(post)) {
    const year = pubDate.getFullYear();
    const month = pubDate.getMonth() + 1;
    const day = pubDate.getDate();

    const noteSlug = slug ?? slugify(title ?? id);

    return `${year}/${month}/${day}/${noteSlug}`;
  }

  if (slug) {
    return slug;
  }

  return slugify(title ?? id);
};

export const getEntryUrl = (entry: Entry) => {
  const slug = getPostSlug(entry);

  if (isNoteEntry(entry)) {
    return `/blog/${slug}/`;
  }

  if (isProjectEntry(entry)) {
    return `/projects/${slug}/`;
  }

  return `/posts/${slug}/`;
};

export const getTagsSummaries = async (): Promise<TagSummary[]> => {
  const entries = await getPublishedTaggedContent(true);

  const tags = entries.flatMap(entry => entry.data.tags ?? []);

  const tagsCount = tags.reduce(
    (acc, tag) => {
      acc[tag.slug] = acc[tag.slug] ?? {
        count: 0,
        href: `/tags/${tag.slug}/`,
        tag
      };
      acc[tag.slug].count++;
      return acc;
    },
    {} as Record<string, TagSummary>
  );

  const tagsSorted = Object.entries(tagsCount).sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase())
  );

  return tagsSorted.map(([_, tag]) => tag);
};

export const getPostsTags = async (): Promise<Tag[]> => {
  const entries = await getPublishedTaggedContent(true);

  const tags = entries.flatMap(entry => entry.data.tags ?? []);
  const seen = new Set();
  return tags.filter(item => {
    const slug = item.slug;
    return seen.has(slug) ? false : (seen.add(slug), true);
  });
};

export const filterEntriesByTagSlug = (
  entries: Entry[],
  slug: string
): Entry[] =>
  entries.filter(entry => entry.data.tags?.some(tag => tag.slug === slug));

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

export const getPublishedTaggedContent = async (
  sortByDate = true
): Promise<Entry[]> => {
  const notes = await getPublishedNotes();
  const posts = await getPublishedPosts(true);
  // const projects = await getPublishedProjects();

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
