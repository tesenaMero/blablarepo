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

    // One box one preProduct
    private preProducts = [];

    // Consts
    private SALES_DOCUMENT_TYPE = '1';

    private loadings = {
        products: true,
        contracts: true,
        projectProfiles: true,
        catalog: true
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
        private catalogApi: CatalogApi,
        private customerService: CustomerService,
        private paymentTermsApi: PaymentTermsApi,
        private plantApi: PlantApi,
    ) {
        this.step.setEventsListener(this);
        this.add(); // Push a pre product
    }

    onShowed() {
        this.onCompleted.emit();

        // Set loading state
        this.preProducts.forEach((item) => {
            item.loadings.products = true;
        });

        this.fetchProducts();
        this.getPaymentTerms();
        this.getProjectProfiles();
        this.getPlants();
    }

    fetchProducts() {
        let salesDocumentType = this.manager.getSalesDocumentType();
        this.api.top(this.manager.jobsite, salesDocumentType, this.manager.productLine, this.manager.shippingCondition).subscribe((result) => {
            let topProducts = result.json().products;
            if (!topProducts.length) { return; }

            SpecificationsStepComponent.availableProducts = topProducts;

            // Set defaults value(
            this.preProducts.forEach((item) => {
                item.loadings.products = false;
                if (topProducts.length > 0)
                    item.product = topProducts[0];
                this.productChanged(item);
            });

            this.getUnits(topProducts[0].product.productId);
            this.manager.setProducts(this.preProducts);
        });
    }

    getPlants() {
        if (this.manager.jobsite && this.manager.shippingCondition && this.manager.shippingCondition.shippingConditionId == 2) {
            this.plantApi.byCountryCodeAndRegionCode(this.manager.jobsite.address.countryCode, this.manager.jobsite.address.regionCode).subscribe((response) => {
                SpecificationsStepComponent.plants = response.json().plants;
            });
        }
    }

    paymentTermChanged(term) {
        //this.selectedProduct.payment = term;
    }

    getPaymentTerms() {
        let paymentTermIds = '';

        this.manager.salesArea.map((area: any) => {
            paymentTermIds = paymentTermIds + area.paymentTerm.paymentTermId + ',';
        });

        this.paymentTermsApi.getJobsitePaymentTerms(paymentTermIds).subscribe((result) => {
            const terms = result.json().paymentTerms;
            let uniqueTerms = [];

            // Find type Cash
            const cachePayment = terms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeDesc === 'Cash';
            });

            // Find type Credit
            const creditPayment = terms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeDesc === 'Credit';
            });


            // Push to terms array
            cachePayment && uniqueTerms.push(cachePayment);
            creditPayment && uniqueTerms.push(creditPayment);
            SpecificationsStepComponent.availablePayments = terms;
        });
    }

    getProjectProfiles() {
        const customerId = this.customerService.currentCustomer().legalEntityId;

        this.loadings.projectProfiles = true;
        this.ProjectProfileApi.all(customerId).subscribe((response) => {
            this.loadings.projectProfiles = false;
            const profiles = response.json().profiles;
            if (profiles) {
                SpecificationsStepComponent.projectProfiles = profiles;
            }
        });

        this.loadings.catalog = true;
        this.catalogApi.byProductLine(customerId, '0006').subscribe((res: any) => {
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
            SpecificationsStepComponent.availableUnits = units
            this.preProducts.forEach(item => {
                if (units.length > 0)
                    item.unit = units[0];
            });
        });
    }

    productChanged(preProduct: any) {
        let product = preProduct.product;
        preProduct.loadings.contracts = true;

        this.api.fetchContracts(
            this.manager.jobsite,
            this.SALES_DOCUMENT_TYPE,
            this.manager.productLine,
            this.manager.shippingCondition,
            preProduct.product.product.productId
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

            preProduct.loadings.contracts = false;
        });
    }

    contractChanged(contract) {
        this.getUnits(contract.salesDocument.salesDocumentId);
        //this.selectedProduct = contract;
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

    loadings = {
        products: true,
        contracts: true,
        projectProfiles: true,
        catalog: true
    }

    constructor(private manager: CreateOrderService) {
        let _ = SpecificationsStepComponent;

        this.contract = _.availableContracts[0];
        this.unit = _.availableUnits[0];
        this.payment = _.availablePayments[0];
        this.plant = _.availablePlants[0];
        this.paymentOption = _.availablePayments[0];

        if (_.availableProducts.length) { this.product = _.availableProducts[0]; }

        // What the f is this
        this.manager._productSelectedProduct.subscribe(product => {
            let filteredProducts = _.availableProducts.filter((availableProduct: any) => availableProduct.commercialCode === product.commercialCode);

            if (filteredProducts.length) {
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