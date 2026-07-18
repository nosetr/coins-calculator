import { Pipe, PipeTransform } from '@angular/core';
import { TableTypeEnum } from '../shared/enums';

@Pipe({
  name: 'countFormat',
  pure: false,
  standalone: true
})
export class CountFormatPipe implements PipeTransform {

  transform(value: number, type: TableTypeEnum): string {
    return (value > 0 && type === TableTypeEnum.DIFFERENCE) ? `+${value}` : `${value}`;
  }
}
