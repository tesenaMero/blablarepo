import { PipeTransform, Pipe } from '@angular/core';
import { CartProductGroup } from '../models/index';

@Pipe({
    name: 'sumProduct'
})
export class SumGroupProductPipe implements PipeTransform {

    transform(items: CartProductGroup[]) {
        let sum:number = 0;
        for (let group of items) {
            for (let product of group.products) {
                sum += product.quantity * product.unitaryPrice;
            }
        }

        return sum;
    }
}
