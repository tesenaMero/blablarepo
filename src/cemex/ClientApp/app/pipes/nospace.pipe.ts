import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
    name: 'nospace'
})

@Injectable()
export class NoSpacePipe implements PipeTransform {
    transform(input: any, args?: any): any {
        if (input) {
            return input.replace(/\s+/g, '-').toLower();
        }
    }
}