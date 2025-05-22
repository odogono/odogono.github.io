import type { CollectionEntry } from 'astro:content';

interface EntryProps {
  url: string;
}

export type EntryTypes = 'posts' | 'notes' | 'projects';

export type PostEntry = CollectionEntry<'posts'> & EntryProps;
export type NoteEntry = CollectionEntry<'notes'> & EntryProps;
export type ProjectEntry = CollectionEntry<'projects'> & EntryProps;

export type Entry = NoteEntry | PostEntry | ProjectEntry;

export interface PostImage {
  format: 'png' | 'jpg' | 'jpeg' | 'tiff' | 'webp' | 'gif' | 'svg' | 'avif';
  height: number;
  src: string;
  width: number;
}

export interface PostSummary {
  description?: string;
  heroImage: PostImage | string;
  pubDate: Date;
  tags?: Tag[];
  title: string;
  url: string;
}

export interface ProjectSummary {
  description?: string;
  heroImage: PostImage | string;
  pubDate: Date;
  tags?: Tag[];
  title: string;
  url: string;
}

export interface DateEntry {
  date: string;
}

export type NotesPageEntry = DateEntry | Entry;

export interface Tag {
  slug: string;
  title: string;
}

export interface TagSummary {
  count: number;
  href: string;
  tag: Tag;
}
