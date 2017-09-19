import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { PaymentTermsApi } from '../../../../shared/services/api/payment-terms.service';

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss', './specifications.utils.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent implements StepEventsListener {
    @Output() initializeProductColorsEmitter = new EventEmitter<any>();
    @Output() onCompleted = new EventEmitter<any>();
    private READYMIX_LINE = 6;

    private preProducts = [];
    private loadings = {
        products: true,
        contracts: true
    }
    private selectedProduct: any;
    initializeProductSearch() {
        this.manager.fetchProductColors(this.manager.productLine.productLineId);
    }

    static availableUnits = [];

    get availableUnits() {
        return SpecificationsStepComponent.availableUnits;
    }

    static availablePayments = [];

    get availablePayments() {
        return SpecificationsStepComponent.availablePayments;
    }

    static availableContracts = [
        {
            "salesDocument": {
                "salesDocumentCode": "Select Contract"
            }
        }
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

    constructor( @Inject(Step) private step: Step, private api: ProductsApi, private manager: CreateOrderService, private paymentTermsApi: PaymentTermsApi) {
        this.step.setEventsListener(this);
        this.add(); // Push a pre product
    }

    onShowed() {
        this.onCompleted.emit();
        this.loadings.products = true;
        
        let salesDocumentType = '3';
        if (this.manager.productLine.productLineId == this.READYMIX_LINE) { 
            salesDocumentType = '1'; 
        }

        this.api.top(
            this.manager.jobsite,
            salesDocumentType,
            this.manager.productLine,
            this.manager.shippingCondition
        ).subscribe((result) => {
            let topProducts = result.json().products;
            this.loadings.products = false;
            if (!topProducts.length) { return; }

            SpecificationsStepComponent.availableProducts = topProducts;
            // Set defaults value
            this.preProducts.forEach(item => {
                if (topProducts.length > 0)
                    item.product = topProducts[0];
            });

            this.selectedProduct = topProducts[0];

            this.getUnits(topProducts[0].product.productId);
            this.productChanged(topProducts[0]);

            this.manager.setProducts(this.preProducts);
        });
        this.getPaymentTerms();
    }

    paymentTermChanged(term) {
        this.selectedProduct.payment = term;
    }
    
    getPaymentTerms() {
        let paymentTermIds = '';
        this.manager.salesArea.map((area: any) => {
            paymentTermIds = paymentTermIds + area.paymentTerm.paymentTermId + ',';
        });
        
        this.paymentTermsApi.getJobsitePaymentTerms(paymentTermIds).subscribe((result) => {
            const terms = result.json().paymentTerms;
            let uniqueTerms = [];

            // find type Cache
            const cachePayment = terms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeDesc === 'Cash';
            });

            // find type Credit
            const creditPayment = terms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeDesc === 'Credit';
            });


            // push to terms array
            cachePayment && uniqueTerms.push(cachePayment);
            creditPayment && uniqueTerms.push(creditPayment);
            SpecificationsStepComponent.availablePayments = terms;
        });
    }

    getUnits(product) {
        this.api.units(product).subscribe((result) => {
            let units = result.json().productUnitConversions;
            this.preProducts.forEach(item => {
                if (units.length > 0)
                    item.unit = units[0];
            });
            SpecificationsStepComponent.availableUnits = units
        });
    }

    productChanged(el) {
        this.loadings.contracts = true;
        const salesDocumentType = '1';
        this.api.fetchContracts(
            this.manager.jobsite,
            salesDocumentType,
            this.manager.productLine,
            this.manager.shippingCondition,
            el.product.productId
        ).subscribe((result) => {
            let contracts = result.json().products;
            SpecificationsStepComponent.availableContracts = contracts;
            this.preProducts.forEach(item => {
                if (contracts.length >= 0)
                    item.contract = contracts[0];
            });
            this.preProducts[0].contract = {
                "salesDocument": {
                    "salesDocumentCode": "Select Contract"
                }
            }
            this.loadings.contracts = false;
        });
    }

    contractChanged(contract) {
        this.getUnits(contract.salesDocument.salesDocumentId);
        this.selectedProduct = contract;
    }

    add() {
        this.preProducts.push(new PreProduct(this.manager));
    }

    remove(index: any) {
        let product = this.preProducts[index];
        product.deleting = true;
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
    paymentOption: any;

    constructor(private manager: CreateOrderService) {
        let _ = SpecificationsStepComponent;
        if (_.availableProducts.length > 0) { this.product = _.availableProducts[0]; }
        this.contract = _.availableContracts[0];
        this.unit = _.availableUnits[0];
        this.payment = _.availablePayments[0];
        if (_.availableProducts.length) { this.product = _.availableProducts[0]; }
        this.plant = _.availablePlants[0];
        this.paymentOption = _.availablePayments[0];
        this.manager._productSelectedProduct.subscribe(product => {
            let filteredProducts = _.availableProducts.filter((availableProduct: any) => availableProduct.commercialCode === product.commercialCode);
            if(filteredProducts.length) {
                this.product = filteredProducts[0];
            } else {
                _.availableProducts.push(product);
                this.product = product;
            }
        })
    }

    setProduct(product: any[]) {
        this.product = product;
    }
}