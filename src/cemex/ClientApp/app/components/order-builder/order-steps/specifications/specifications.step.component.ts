import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProductsApi } from '../../../../shared/services/api'

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent {
    private products = [];

    constructor(private api: ProductsApi) { 
        this.products.push(new PreProduct());
        this.api.top({shipmentLocationId: 1058}).subscribe((result) => {
            console.log(result.json());
        });
    }

    add() {
        this.products.push(new PreProduct());
    }

    remove(index: any) {
        let product = this.products[index];
        product.deleting = true;
        console.log(product);
        setTimeout(() => {
            this.products.splice(index, 1);
        }, 400);
    }

    qty(product: any, toAdd: number) {
        if (product.quantity <= 1 && toAdd < 0) { return; }
        if (product.quantity >= 100 && toAdd > 0) { return; }
        product.quantity += toAdd;
    }
}

class PreProduct {
    maneuvering: boolean = false;
    quantity: number = 1;
    date: any = new Date();
    time = new Date("hh:MM");
    constructor() {}
}