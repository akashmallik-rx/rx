import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: number): string {
    const date = this.datePipe.transform(value, "yyyy-MM-dd");
    if (date) {
      return date;
    }
    return "";
  }

}
