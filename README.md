# Abstract Date Picker
> An abstract logic handler for rendering datepickers in any UI framework.

> ⚠️ WARNING: This package is still in need of heavy testing before it is ready for production use. ⚠️

## Installation
```
yarn add abstract-datepicker
```

## Usage

The current intended use for this module is a business application that I work on which uses React for the front end. The below example describes how one would utilize this package in a React context.

```jsx harmony
import React from 'react';
import { createDatePicker } from 'abstract-datepicker';

import { Date, Button, Row, Week } from './styled';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.picker = createDatePicker({
      groupByWeek: true,
    });

    this.state = {
      monthName: '',
      month: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.picker.subscribe(({ month, monthName, year }) => {
      this.setState({
        month,
        monthName,
        year,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  incrementMonth = () => this.picker.incrementMonth();
  decrementMonth = () => this.picker.decrementMonth();

  render() {
    const { monthName, year, month } = this.state;

    return (
      <>
        <Row>
          <Button onClick={this.decrementMonth}>Prev Month</Button>
          <span>{monthName} {year}</span>
          <Button onClick={this.incrementMonth}>Next Month</Button>
        </Row>
        <div>
          {
            month.map((week, idx) => (
              <Week key={`${year}-${monthName}-week-${idx}`}>
                {
                  week.map((day) => (
                    <Date
                      key={day.iso}
                      selected={day.selected}
                    >
                      {day.date}
                    </Date>
                  ))
                }
              </Week>
            ))
          }
        </div>
      </>
    )
  }
}
```

## API

### createDatePicker
- Type: `(?DatePickerOptions) => DatePicker`
- Default: `{}`

> TODO: Quality description

### DatePickerOptions
- Type: `Object`

Params:

| Name | Type | Description 
| --- | --- | ---
| groupByWeek | `boolean` | When true, returns a 2D array where each top-level array represents a week beginning on Sunday in the month 
| initialDate | `Date  \| string` | The initial date the datepicker should utilize. The initial month will be calculated based on initialDate. Default: `new Date()` 
| includeTrailers | `boolean` | Often the first week of a month begins at the end of a previous month (e.g. July 2019 started on a Monday, leaving a trailing Sunday from the previous month). By default, "trailers" are included in the month. 
| retainMonthsRadius | `number` | (NOT YET IMPLEMENTED/UNDER CONSIDERATION) For potential gains (needs benchmarking), calculated months can be retained based on a radius of months relative the currently selected month. That is, a radius of 2 with a selected month of July would hold on to a previously calculated May, June, August and September.
| monthNameFormat | `'short' \| 'long'` | (WILL LIKELY ABROGATE IN FAVOR OF A FORMATTER OR LEAVE UP TO THE CONSUMER)  

### DatePicker
- Type: `Object`

Params:

| Name | Type | Description
| --- | --- | ---
| subscribe | `(DatePickerState) => () => void` | A function that will subscribe a callback to changes in the datepicker. The function returns a function that when called will unsubscribe the function from updates.
| incrementMonth | `() => void` | Increment the current month forward 
| decrementMonth | `() => void` | Decrement the current month backward
| resetMonth | `() => void` | Reset the current month to be inline with the currently selected date
| setDate | `(Date) => void` | Set the selected date

### DatePickerState
- Type: `Object`

Params:

| Name | Type | Description
| --- | --- | ---
| month | `Array<DatePickerDate>` | An array of dates to be rendered by the renderer
| selectedDate | `Date` | The current selected date
| selectedMonth | `Date` | The current selected month (may not align with date)

### DatePickerDate
- Type: `Object`

Params: 

| Name | Type | Description
| --- | --- | ---
| day | `Date` | The day of the week to which the date belongs
| date | `number` | The day of the month
| iso | `string` | An ISO-8601 formatted date-time string in UTC
| obj | `Date` | A native JS Date object
| selected | `boolean` | Whether the date is the currently selected date
