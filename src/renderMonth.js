import {
  startOfMonth,
  isEqual,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfDay,
} from 'date-fns';

export default (selectedMonth, selectedDate, trailers = true) => {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const start = trailers ? startOfWeek(monthStart) : monthStart;
  const end = trailers ? endOfWeek(monthEnd) : monthEnd;

  let currentDate = start;

  const dates = [];

  while (!isEqual(currentDate, startOfDay(end))) {
    dates.push({
      date: currentDate.getDate(),
      day: currentDate.getDay(),
      iso: currentDate.toISOString(),
      obj: currentDate,
      selected: isEqual(currentDate, startOfDay(selectedDate)),
    });
    currentDate = addDays(currentDate, 1);
  }

  dates.push({
    date: end.getDate(),
    day: end.getDay(),
    iso: startOfDay(end).toISOString(),
    obj: startOfDay(end),
    selected: isEqual(currentDate, startOfDay(selectedDate)),
  });

  return dates;
};