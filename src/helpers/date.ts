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

export const toDateTimeString = (date: Date | string) =>
  format(new Date(date), 'yyyy/MM/dd HH:mm');

export const toDate = (dateString?: Date | string | undefined): Date => {
  if (!dateString || dateString === '-' || dateString === 'current') {
    return new Date();
  }
  return typeof dateString === 'string' ? new Date(dateString) : dateString;
};

export const isDate = (date: unknown | undefined): date is Date => {
  if (!date) {
    return false;
  }

  return (
    Object.prototype.toString.call(date) === '[object Date]' &&
    !Number.isNaN(date)
  );
};

export const isToday = (date: Date) => isSameDay(date, new Date());
