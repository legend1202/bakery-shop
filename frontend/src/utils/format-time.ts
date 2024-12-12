import { format, getTime, parseISO, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined | any;

// export function fmDate(date: any, newFormat?: string) {
//   const fm = newFormat || 'dd/MM/yyyy';

//   return date ? format(new Date(date), fm) : '';
// }

export function fmDate(date: any, newFormat?: string) {
  const fm = newFormat || 'dd/MM/yyyy';

  // Parse the date using parseISO if it's a string in ISO format
  // eslint-disable-next-line no-nested-ternary
  const parsedDate = date ? (typeof date === 'string' ? parseISO(date) : new Date(date)) : null;

  return parsedDate ? format(parsedDate, fm) : '';
}

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function isBetween(inputDate: Date | string | number, startDate: Date, endDate: Date) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}
