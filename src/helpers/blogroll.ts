import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface BlogrollEntry {
  author: string;
  site: string;
}

export const getBlogroll = (): Record<string, BlogrollEntry> => {
  const blogrollPath = join(process.cwd(), 'data', 'blogroll.toml');
  const content = readFileSync(blogrollPath, 'utf8');
  return Bun.TOML.parse(content) as Record<string, BlogrollEntry>;
};
