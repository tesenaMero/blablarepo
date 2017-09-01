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
        this.products.push({});
        this.api.top({shipmentLocationId: 1058}).subscribe((result) => {
            console.log(result.json());
        });
    }

    add() {
        this.products.push({});
    }

    remove(index: any) {
        let product = this.products[index];
        product.deleting = true;
        setTimeout(() => {
            this.products.splice(index, 1);
        }, 400);
    }
}