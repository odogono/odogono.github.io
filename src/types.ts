import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export type PostImage = {
  format: 'png' | 'jpg' | 'jpeg' | 'tiff' | 'webp' | 'gif' | 'svg' | 'avif';
  height: number;
  src: string;
  width: number;
};
