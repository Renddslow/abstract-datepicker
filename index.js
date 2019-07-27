// @flow
import { has, set } from 'dot-prop';
import uuid from 'uuid/v4';
import { addMonths, subMonths, startOfMonth, format } from 'date-fns';

import rerenderMonth from './src/rerenderMonth';
import renderMonth from './src/renderMonth';
import groupByWeek from './src/groupByWeek';

import {
  Options,
  InternalState,
  Subscriber,
} from './src/types';

const MONTH_STRING_FMT = 'YYYY-MM';

// TODO: work on naming

const toDate = (date) => {
  if (typeof date === 'string') return new Date(date);
  return date;
};

export const createDatePicker = (options: Options = {}) => {
  const initialDate = options.initialDate ? toDate(options.initialDate) : new Date();
  const initialMonth = startOfMonth(initialDate);

  const internalState: InternalState = {
    selectedDate: initialDate,
    selectedMonth: initialMonth,
    months: {
      [format(initialMonth, MONTH_STRING_FMT)]: renderMonth(
        initialMonth,
        initialDate,
        options.includeTrailers,
      ),
    },
  };

  const subsribers = {};

  // Render month should always be called after selectedDate/selectedMonth states
  // have changed.
  const mutateMonth = () => {
    if (_hasMonth(internalState.selectedMonth)) {
      _setState(
        `months.${format(internalState.selectedMonth, MONTH_STRING_FMT)}`,
        rerenderMonth(
          internalState.selectedDate,
          _getMonth(internalState.selectedMonth),
        ));
    } else {
      _setState(
        `months.${format(internalState.selectedMonth, MONTH_STRING_FMT)}`,
        renderMonth(
          internalState.selectedMonth,
          internalState.selectedDate,
          options.includeTrailers,
        ),
      );
    }
  };

  const getCurrentState = () => {
    const month = _getMonth(internalState.selectedMonth);

    return {
      month: options.groupByWeek ? groupByWeek(month) : month,
      monthName: format(internalState.selectedMonth, options.monthNameFormat === 'short' ? 'MMM' : 'MMMM'),
      year: internalState.selectedMonth.getFullYear(),
      selectedMonth: internalState.selectedMonth,
      selectedDate: internalState.selectedDate,
    };
  };

  const updateSubscribers = () => {
    const subscriberKeys = Object.keys(subsribers);

    for (let i = 0; i < subscriberKeys.length; i++) {
      // Theoretically a subscriber could get ditched before it's cb gets called
      // this __should__ prevent that
      if (!has(subsribers, subscriberKeys[i])) {
        continue;
      }

      subsribers[subscriberKeys[i]](getCurrentState());
    }
  };

  const dropMonths = () => {
  };

  const stateSideEffects = {
    selectedMonth: [mutateMonth, dropMonths, updateSubscribers],
    selectedDate: [mutateMonth, dropMonths, updateSubscribers],
    months: [dropMonths, updateSubscribers],
  };

  const mutate = (key) => {
    stateSideEffects[key].forEach((fn) => fn());
  };

  const changeMonth = (increment: boolean = true) => () => {
    if (increment) {
      _setState(
        'selectedMonth',
        addMonths(internalState.selectedMonth, 1),
      );
    } else {
      _setState(
        'selectedMonth',
        subMonths(internalState.selectedMonth, 1),
      );
    }
  };

  const resetMonth = () => _setState('selectedMonth', startOfMonth(internalState.selectedDate));

  const _getMonth = (month: Date) => {
    const monthString = format(month, MONTH_STRING_FMT);
    return internalState.months[monthString];
  };

  const _hasMonth = (month: Date) => {
    const monthString = format(month, MONTH_STRING_FMT);
    return has(internalState.months, monthString);
  };

  const _setState = (key, value) => {
    const [root] = key.split('.');
    set(internalState, key, value);
    mutate(root);
  };

  return {
    subscribe: (subscriber: Subscriber) => {
      const subscriberId = uuid();
      subsribers[subscriberId] = subscriber;
      subsribers[subscriberId](getCurrentState());
      return () => {
        delete subscriber[subscriberId];
      };
    },
    incrementMonth: changeMonth(),
    decrementMonth: changeMonth(false),
    resetMonth: () => resetMonth(),
    setDate: (date: Date) => _setState('selectedDate', date),
  };
};
