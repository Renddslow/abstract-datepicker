// @flow
import { DatePickerDate } from './types';

export default (month: Array<DatePickerDate>) => month
  .reduce((acc, date) => {
    if (!acc.length) {
      acc.push([]);
    }

    if (date.day === 0) {
      acc.push([]);
    }

    acc[acc.length - 1].push(date);

    return acc;
  }, []);