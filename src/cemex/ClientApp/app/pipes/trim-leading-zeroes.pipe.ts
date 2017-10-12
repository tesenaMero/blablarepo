import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'trimLeadingZeroes'
})

export class TrimLeadingZeroesPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value ? String(value).replace(/\b0+/g, '') : '';
  }
}