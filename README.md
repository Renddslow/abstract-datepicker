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