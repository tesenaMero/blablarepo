import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProductsApi } from '../../../../shared/services/api'

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss', './specifications.utils.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent {
    private products = [];

    static availableUnits = [
        { name: "m³" },
        { name: "tons" }
    ];

    get availableUnits() {
        return SpecificationsStepComponent.availableUnits;
    }

    static availablePayments = [
        { name: "Credit" },
        { name: "Cash" }
    ];

    get availablePayments() {
        return SpecificationsStepComponent.availablePayments;
    }

    static availableContracts = [
        { name: "10-20170218903432112212", volume: 180 },
        { name: "11-20170218903432112212", volume: 160 },
        { name: "12-20170218903432112212", volume: 140 },
    ];

    get availableContracts() {
        return SpecificationsStepComponent.availableContracts;
    }

    static availableProducts = [
        { name: "Cement - SCAH - CHM89" },
        { name: "Cement - SCAH - CHM90" },
        { name: "Cement - SCAH - CHM91" }
    ];

    get availableProducts() {
        return SpecificationsStepComponent.availableProducts;
    }

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
    time: any;
    unit: any;
    payment: any;
    contract: any;
    product: any;
    constructor() {
        let _ = SpecificationsStepComponent;
        this.contract = _.availableContracts[0];
        this.unit = _.availableUnits[0];
        this.payment = _.availablePayments[0];
        this.product = _.availableProducts[0];
    }
}