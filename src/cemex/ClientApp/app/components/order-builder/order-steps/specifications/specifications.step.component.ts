import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss', './specifications.utils.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent implements StepEventsListener {
    private preProducts = [];
    private loadings = {
        products: true
    }

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
        // { name: "‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ", volume: "‌‌ ‌‌ ‌‌ " },
        // { name: "10-20170218903432112212", volume: 180 },
        // { name: "11-20170218903432112212", volume: 160 },
        // { name: "12-20170218903432112212", volume: 140 },
    ];

    get availableContracts() {
        return SpecificationsStepComponent.availableContracts;
    }

    static availableProducts = [];

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

    constructor( @Inject(Step) private step: Step, private api: ProductsApi, private manager: CreateOrderService) {
        this.step.setEventsListener(this);
        this.add(); // Push a pre product
    }

    onShowed() {
        this.loadings.products = true;
        const salesDocumentType = '3'
        this.api.top(
            this.manager.jobsite,
            salesDocumentType,
            this.manager.productLine,
            this.manager.shippingCondition
        ).subscribe((result) => {
            let topProducts = result.json().products;
            SpecificationsStepComponent.availableProducts = topProducts;
            
            // Set defaults value
            this.preProducts.forEach(item => {
                if (topProducts.length > 0)
                    item.product = topProducts[0];
            });

            this.manager.setProducts(this.preProducts);
            this.loadings.products = false;
        });
    }

    productChanged(event) {
        const salesDocumentType = '1'
        this.api.fetchContracts(
            this.manager.jobsite,
            salesDocumentType,
            this.manager.productLine,
            this.manager.shippingCondition,
            event.product.productId
        ).subscribe((result) => {
            let contracts = result.json().products;
            SpecificationsStepComponent.availableContracts = contracts;
            this.loadings.products = false;
        });
    }

    add() {
        this.preProducts.push(new PreProduct());
    }

    remove(index: any) {
        let product = this.preProducts[index];
        product.deleting = true;
        console.log(product);
        setTimeout(() => {
            this.preProducts.splice(index, 1);
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
        if (_.availableProducts.length > 0) { this.product = _.availableProducts[0]; }
        this.contract = _.availableContracts[0];
        this.unit = _.availableUnits[0];
        this.payment = _.availablePayments[0];
        this.product = _.availableProducts[0];
        this.plant = _.availablePlants[0];
    }

    setProduct(product: any[]) {
        this.product = product;
    }
}