// @flow

type MonthFormats = 'short' | 'long';

export type Options = {
  groupByWeek: boolean,
  initialDate: Date | string,
  includeTrailers: boolean,
  retainMonthsRadius: number,
  monthNameFormat: MonthFormats,
};

export type InternalState = {
  selectedDate: Date,
  selectedMonth: Date,
  months: { [string]: Array<DatePickerDate> },
};

export type Subscriber = ({
  month: Array<DatePickerDate>,
  selectedDate: Date,
  selectedMonth: Date,
}) => () => void;

export type DatePickerDate = {
  day: Date,
  date: number,
  iso: string,
  obj: Date,
  selected: boolean,
};