import { isEqual } from 'date-fns';

export default  (selectedDate, dates) => dates.map((date) => Object.assign({}, date, {
  selected: isEqual(date.obj, selectedDate),
}));
