import { PipeTransform, Pipe } from '@angular/core';
import { CartProductGroup,IProductSpecification } from '../models';

@Pipe({
    name: 'sumGpoProduct'
})
export class SumGroupProductPipe implements PipeTransform {

    transform(items: any) {
        let sum:number = 0;
        let itemsProductGroup:CartProductGroup[] = <CartProductGroup[]>items;
        //Check if it's a CartProductGroup[]
        if (itemsProductGroup.length && itemsProductGroup[0].products){
            for (let group of items) {
                for (let product of group.products) {
                    sum += product.quantity * product.unitaryPrice;
                }
            }
        } else {
            let itemsProduct:IProductSpecification[] = <IProductSpecification[]>items;
            //console.log("itemsProduct:", itemsProduct);
            for (let product of itemsProduct) {
                sum += product.quantity * product.unitaryPrice;
            }
        }

        return sum;
    }
}


