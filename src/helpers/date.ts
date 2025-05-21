import { format, isSameDay as isSameDayFn } from 'date-fns';

export const isSameDay = (date1: Date, date2: Date) =>
  isSameDayFn(date1, date2);

export const toShortDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

export const toDateString = (date: Date | string) =>
  format(new Date(date), 'yyyy/MM/dd');
