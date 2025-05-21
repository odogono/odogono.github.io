import { useState } from 'react';

import { createLog } from '@helpers/log';

interface DraftToggleProps {
  id: string;
  isDraft: boolean | undefined;
  onToggle: (id: string, newValue: boolean) => Promise<void>;
}

const log = createLog('components/admin/draft-toggle');

export const DraftToggle = ({ id, isDraft, onToggle }: DraftToggleProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(isDraft ?? false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const newValue = !isChecked;
      await onToggle(id, newValue);
      setIsChecked(newValue);
    } catch (error) {
      log.error('Failed to update draft status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:font-bold disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isLoading}
      onClick={handleClick}
      title={isChecked ? 'Draft' : 'Published'}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      ) : isChecked ? (
        '✗'
      ) : (
        '✓'
      )}
    </button>
  );
};
