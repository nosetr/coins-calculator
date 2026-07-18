import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countFormat',
  pure: false,
  standalone: true
})
export class CountFormatPipe implements PipeTransform {

  transform(value: number): string {
    return value > 0 ? `+${value}` : `${value}`;
  }
}
