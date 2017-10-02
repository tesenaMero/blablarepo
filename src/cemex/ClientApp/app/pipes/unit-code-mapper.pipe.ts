import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
    name: 'unitCodeMapper'
})
export class UnitCodeMapperPipe implements PipeTransform {
    transform(input: any, args?: any): any {
        return input === 'TO' ? 'TN' : input;
    }
}