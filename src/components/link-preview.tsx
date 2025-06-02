import { useEffect, useState } from 'react';

import { createLog } from '@helpers/log';

import { getLinkMetadata } from '../helpers/metadata';

interface LinkMetadata {
  description: string | null;
  image: string | null;
  siteName: string | null;
  title: string;
}

interface LinkPreviewProps {
  class?: string;
  type?: 'twitter' | 'facebook' | 'default';
  url: string;
}

const log = createLog('LinkPreview');

export const LinkPreview = ({
  class: className = 'mb-12',
  type = 'default',
  url
}: LinkPreviewProps) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const metadata = await getLinkMetadata(url);

        if (metadata) {
          setMetadata(metadata);
          return;
        }
      } catch {
        setError('Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (isLoading) {
    return (
      <div
        className={`link-preview animate-pulse overflow-hidden rounded-lg border shadow-sm ${className}`}
      >
        <div className="flex flex-col p-3 md:flex-row">
          <div className="min-h-48 w-full rounded-md bg-gray-200 md:h-full md:w-1/3"></div>
          <div className="flex-1 p-4">
            <div className="mb-2 h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div
        className={`link-preview overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800 ${className}`}
      >
        <a
          className="block p-4"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="text-gray-600 dark:text-gray-300">{url}</div>
        </a>
      </div>
    );
  }

  const cardClass =
    type === 'twitter'
      ? 'bg-white dark:bg-gray-800'
      : type === 'facebook'
        ? 'bg-white dark:bg-gray-800'
        : 'bg-white dark:bg-gray-800';

  return (
    <div
      className={`link-preview overflow-hidden rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md ${cardClass} ${className}`}
    >
      <a
        className="block no-underline hover:no-underline"
        href={url}
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
        target="_blank"
      >
        <div className="flex flex-col items-center p-3 md:flex-row">
          {metadata.image && (
            <div className="min-h-48 w-full rounded-md md:w-1/3">
              <img
                alt={metadata.title}
                className="min-h-48 w-full object-cover md:h-full"
                src={metadata.image}
              />
            </div>
          )}
          <div className="flex-1 p-4">
            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              {metadata.siteName}
            </div>
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
              {metadata.title}
            </h3>
            {metadata.description && (
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {metadata.description}
              </p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};
