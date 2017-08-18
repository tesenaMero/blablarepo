import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
    name: 'zeropad'
})

@Injectable()
export class ZeroPadPipe implements PipeTransform {
    transform(input: any, size: number): any {
        if (input) {
            var s = input + "";
            while (s.length < size) s = "0" + s;
            return s;
        }
    }
}