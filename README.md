# Abstract Date Picker
> An abstract logic handler for rendering datepickers in any UI framework.

## Installation
```
yarn add abstract-datepicker
```

## Usage

The current intended use for this module is a business application that I work on which uses React for the front end. The below example describes how one would utilize this package in a React context.

```jsx harmony
import React from 'react';
import { createDatePicker } from 'abstract-datepicker';

import { DatePickerContainer, DatePickerHeader, Calendar } from './styled';

export default class Picker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedDate: this.props.value || new Date(),
    };
    
    this.picker = createDatePicker({});
  }
  
  componentDidMount() {
    this.unsubscribe = this.picker.subscribe((state) => {
      this.setState(state);  
    });
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  handleClick = (date) => (e) => {
    e.stopPropagation();
    this.picker.setSelected(date);
  };
  
  render() {
    return (
      <DatePickerContainer>
        <DatePickerHeader />
        <Calendar>
          {
            this.picker.dates.map((date) => (
              <Date key={date.id} onClick={this.handleClick(date)}>{date.date}</Date>
            ))
          }
        </Calendar>
      </DatePickerContainer>
    );
  }
}
```