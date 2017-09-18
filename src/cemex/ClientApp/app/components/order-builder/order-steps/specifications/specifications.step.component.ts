import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { PaymentTermsApi } from '../../../../shared/services/api/payment-terms.service';
import { ProjectProfileApi, CatalogApi } from '../../../../shared/services/api';

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss', './specifications.utils.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    private preProducts = [];
    private loadings = {
        products: true,
        contracts: true,
        projectProfiles: true,
        catalog: true
    }
    private selectedProduct: any;

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

    static projectProfiles = [];

    get projectProfiles() {
        return SpecificationsStepComponent.projectProfiles;
    }

    static catalogs = [];

    get catalogs() {
        return SpecificationsStepComponent.catalogs;
    }

    constructor(
        @Inject(Step) private step: Step, 
        private api: ProductsApi, 
        private manager: CreateOrderService, 
        private ProjectProfileApi: ProjectProfileApi,
        private CatalogApi: CatalogApi,
        private paymentTermsApi: PaymentTermsApi
    ) {
        this.step.setEventsListener(this);
        this.add(); // Push a pre product
    }

    onShowed() {
        this.onCompleted.emit();
        this.loadings.products = true;
        const salesDocumentType = '3';
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
        this.getProjectProfiles();
        
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

    getProjectProfiles() {
        this.loadings.projectProfiles = true;
        this.ProjectProfileApi.all('354').subscribe((response) => {
            this.loadings.projectProfiles = false;
            const profiles = response.json().profiles;
            if (profiles) {
                SpecificationsStepComponent.projectProfiles = profiles;
            }
        });

        this.loadings.catalog = true;
        this.CatalogApi.byProductLine('354', '0006').subscribe((res: any) => {
            this.loadings.catalog = false;
            res.json().catalogs && res.json().catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
        });
    }

    projectProfileChange(projectProfile) {
        console.log('project profile change', projectProfile);
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
        this.preProducts.push(new PreProduct());
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
    paymentOption: any;
    projectProfile: any = {};

    constructor() {
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