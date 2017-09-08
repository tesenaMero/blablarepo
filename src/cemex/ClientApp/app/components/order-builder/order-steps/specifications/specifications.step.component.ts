import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProductsApi } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss', './specifications.utils.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent implements StepEventsListener {
    private products = [];

    static availableUnits = [
        { name: "m³" },
        { name: "tons" }
    ];

    get availableUnits() {
        return SpecificationsStepComponent.availableUnits;
    }

    static availablePayments = [
        { name: "Cash" },
        { name: "Credit" }
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

    static availablePlants = [
        { name: "Cemex, Mladá Boleslav, Palackeho 50, Mladá Boleslav II, Czechia" },
        { name: "Cemex, Monterrey Mex, La arrolladora, El komander, Fierro" },
    ];

    get availablePlants() {
        return SpecificationsStepComponent.availablePlants;
    }

    constructor( @Inject(Step) private step: Step, private api: ProductsApi, private orders: CreateOrderService) {
        this.products.push(new PreProduct());
        this.step.setEventsListener(this);
    }

    onShowed() {
        this.api.top(this.orders.jobsite).subscribe((result) => {
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
    plant: any;
    projectProfile: any;
    constructor() {
        let _ = SpecificationsStepComponent;
        this.contract = _.availableContracts[0];
        this.unit = _.availableUnits[0];
        this.payment = _.availablePayments[0];
        this.product = _.availableProducts[0];
        this.plant = _.availablePlants[0];
    }
}