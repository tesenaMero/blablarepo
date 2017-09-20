import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { PaymentTermsApi } from '../../../../shared/services/api/payment-terms.service';
import { ProjectProfileApi, CatalogApi, PlantApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';

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
        contracts: true,
        projectProfiles: true,
        catalog: true
    }
    private selectedProduct: any;
    private shouldShowManeouvering: boolean;
    private catalogs: any = {};

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

    static projectProfiles = [];

    get projectProfiles() {
        return SpecificationsStepComponent.projectProfiles;
    }

    static catalogs = [];

    get catalogs() {
        return SpecificationsStepComponent.catalogs;
    }

    static plants = [];

    get plants() {
        return SpecificationsStepComponent.plants;
    }


    constructor(
        @Inject(Step) private step: Step,
        private api: ProductsApi,
        private manager: CreateOrderService,
        private ProjectProfileApi: ProjectProfileApi,
        private CatalogApi: CatalogApi,
        private paymentTermsApi: PaymentTermsApi,
        private CustomerService: CustomerService,
        private plantApi: PlantApi,
    ) {
        this.step.setEventsListener(this);
        console.log('manager: ', this.manager);
        const customerId = 354;
        this.CatalogApi.byProductLine(customerId, '0006').map((response) => response.json()).subscribe((response) => {
            response.catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
        });
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
            console.log('asd: ', result.json(),  this.manager);
            let topProducts = result.json().products;
            this.loadings.products = false;
            console.log('this.manager.salesArea', this.manager.salesArea, this.manager, SpecificationsStepComponent);
            // if is maneouvarable in Jobsite and it's cement delivery
            console.log('info:', this.manager.salesArea.maneuverable,
                this.manager.shippingCondition.shippingConditionId === 1, this.manager.shippingCondition.shippingConditionId,
                this.manager.productLine.productLineId === '2,3', this.manager.productLine.productLineId)

            if(this.manager.salesArea.maneuverable
                && this.manager.shippingCondition.shippingConditionId === 1
                && this.manager.productLine.productLineId === '2,3'
            ) {
                this.shouldShowManeouvering = true;
                console.log('enable maneouvering', this.selectedProduct);
            }
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
        this.getPlants();
    }

    getPlants() {
        if (this.manager.jobsite && this.manager.shippingCondition && this.manager.shippingCondition.shippingConditionId == 2) {
            this.plantApi.byCountryCodeAndRegionCode(
                this.manager.jobsite.address.countryCode,
                this.manager.jobsite.address.regionCode
            ).subscribe((response) => {
                SpecificationsStepComponent.plants = response.json().plants;
            });
        }
    }

    paymentTermChanged(term) {
        this.selectedProduct.payment = term;
    }
    
    getPaymentTerms() {
        // console.log('get payment terms', this.manager)
        let paymentTermIds = '';
        this.manager.salesArea.map((area: any) => {
            paymentTermIds = paymentTermIds + area.paymentTerm.paymentTermId + ',';
        });
        
        this.paymentTermsApi.getJobsitePaymentTerms(paymentTermIds).subscribe((result) => {
            const terms = result.json().paymentTerms;
            console.log('terms: ', terms);
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
        const customerId = this.CustomerService.currentCustomer().legalEntityId;

        this.loadings.projectProfiles = true;
        this.ProjectProfileApi.all(customerId).subscribe((response) => {
            this.loadings.projectProfiles = false;
            const profiles = response.json().profiles;
            if (profiles) {
                SpecificationsStepComponent.projectProfiles = profiles;
            }
        });

        this.loadings.catalog = true;
        this.CatalogApi.byProductLine(customerId, '0006').subscribe((res: any) => {
            this.loadings.catalog = false;
            res.json().catalogs && res.json().catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
        });
    }

    projectProfileChange(projectProfile) {
        // TODO use index &&  _.pick
        this.preProducts[0].projectProfile = projectProfile.project.projectProperties;
    }

    onChangeDischargeTime(index) {
        const entry = this.catalogs['DCT'][index];

        this.preProducts[0].projectProfile.dischargeTime = {
            dischargeTimeId: entry.entryId,
            timePerDischargeDesc: entry.entryDesc
        };
    }

    onChangeTransportMethod(index) {
        const entry = this.catalogs['TPM'][index];

        this.preProducts[0].projectProfile.transportMethod = {
            transportMethodId: entry.entryId,
            transportMethodDesc: entry.entryDesc
        };
    }

    onChangeUnloadType(index) {
        const entry = this.catalogs['ULT'][index];

        this.preProducts[0].projectProfile.unloadType = {
            unloadTypeId: entry.entryId,
            unloadTypeDesc: entry.entryDesc
        };
    }

    onChangePumpCapacity(index) {
        const entry = this.catalogs['PCC'][index];

        this.preProducts[0].projectProfile.pumpCapacity = {
            pumpCapacityId: entry.entryId,
            pumpCapacityDesc: entry.entryDesc
        };
    }

    onChangeApplication(index) {
        const entry = this.catalogs['ELM'][index];

        this.preProducts[0].projectProfile.element = {
            elementId: entry.entryId,
            elementDesc: entry.entryDesc
        };
    }

    onChangeLoadSize(index) {
        const entry = this.catalogs['LSC'][index];

        this.preProducts[0].projectProfile.loadSize = {
            loadSizeId: entry.entryId,
            loadSizeDesc: entry.entryDesc
        };
    }

    onChangeTimePerLoad(index) {
        const entry = this.catalogs['TPL'][index];

        this.preProducts[0].projectProfile.timePerLoad = {
            timePerLoadId: entry.entryId,
            timePerLoadDesc: entry.entryDesc
        };
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
            console.log('contracts: ', result.json,  this.manager);
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
    paymentOption: any;
    projectProfile: any = {};

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
        });
    }

    setProduct(product: any[]) {
        console.log('product: ', this.manager);
        this.product = product;
    }
}