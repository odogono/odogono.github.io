/**
 * Waits for a given number of milliseconds
 * @param time Number of milliseconds to wait
 * @returns Promise that resolves after the given time
 */
export const waitMs = async (time: number = 1000): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });

export type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Runs a function after a given number of milliseconds
 * @param time Number of milliseconds to wait
 * @param fn Function to run
 */
export const runAfterMs = (time: number, fn: () => void): TimeoutId =>
  setTimeout(() => fn(), time);

export const clearRunAfterMs = (timeoutId: TimeoutId | null | undefined) => {
  if (!timeoutId) {
    return undefined;
  }
  clearTimeout(timeoutId);
  return undefined;
};
