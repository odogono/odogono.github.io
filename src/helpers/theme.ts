import { atom, useAtomValue, useSetAtom } from 'jotai';

import { createLog } from '@helpers/log';

const log = createLog('helpers/theme');

export type Theme = 'light' | 'dark';

export const systemTheme: Theme =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const setDocumentTheme = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
};

const themeAtom = atom<Theme>(systemTheme);

themeAtom.onMount = setAtom => {
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return;
  }

  // Initialize from localStorage
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) {
    setAtom(stored);
    setDocumentTheme(stored);
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? 'dark' : 'light';
    setAtom(newTheme);
    setDocumentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.storageArea === localStorage && e.key === 'theme') {
      const newTheme = e.newValue as Theme;
      setAtom(newTheme);
      setDocumentTheme(newTheme);
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  window.addEventListener('storage', handleStorageChange);
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
    window.removeEventListener('storage', handleStorageChange);
  };
};

const toggleThemeAtom = atom(null, (get, set) => {
  const currentTheme = get(themeAtom);
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  set(themeAtom, newTheme);
  setDocumentTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

export const useTheme = () => {
  const theme = useAtomValue(themeAtom);
  const toggleTheme = useSetAtom(toggleThemeAtom);

  return { theme, toggleTheme } as const;
};
