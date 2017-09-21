import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { PaymentTermsApi } from '../../../../shared/services/api/payment-terms.service';
import { ProjectProfileApi, CatalogApi, PlantApi, ContractsApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { SearchProductService } from '../../../../shared/services/product-search.service';
import { DeliveryMode } from '../../../../models/delivery.model';

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
    private MODE = DeliveryMode;
    private SALES_DOCUMENT_TYPE = '1';

    private loadings = {
        products: true,
        contracts: true,
        projectProfiles: true,
        catalog: true
    }

    static availablePayments = [];
    get availablePayments() {
        return SpecificationsStepComponent.availablePayments;
    }

    static availableProducts = [];
    get availableProducts() {
        return SpecificationsStepComponent.availableProducts;
    }

    static availablePlants = [];
    get availablePlants() {
        return SpecificationsStepComponent.availablePlants;
    }

    static projectProfiles = [];
    get projectProfiles() {
        return SpecificationsStepComponent.projectProfiles;
    }

    private readyMixAdditionalServices = [];

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
        private productsApi: ProductsApi,
        private manager: CreateOrderService,
        private ProjectProfileApi: ProjectProfileApi,
        private catalogApi: CatalogApi,
        private customerService: CustomerService,
        private contractsApi: ContractsApi,
        private paymentTermsApi: PaymentTermsApi,
        private plantApi: PlantApi,
        private searchProductService: SearchProductService
    ) {
        this.step.setEventsListener(this);
        this.step.canAdvance = () => this.canAdvance();
    }

    openProductSearch(preProduct: PreProduct) {
        this.manager.fetchProductColors(this.manager.productLine.productLineId);

        // What the f is this
        this.searchProductService.searchedProduct.subscribe(product => {
            if (product) {
                let filteredProducts = SpecificationsStepComponent.availableProducts.filter((availableProduct: any) => availableProduct.commercialCode === product.commercialCode);

                if (filteredProducts.length) { preProduct.product = filteredProducts[0]; }

                // Ask reio wtf is this
                // else {
                //     SpecificationsStepComponent.availableProducts.push(product);
                //     preProduct.product = product;
                // }
            }
        });
    }

    canAdvance(): boolean {
        this.manager.setProducts(this.preProducts);
        return true;
    }

    onShowed() {
        // Add a pre product by default
        if (this.preProducts.length <= 0) { this.add(); }
        console.log(' this.manager.productLine: ',  this.manager.productLine,  this.manager);

        const customerId = this.customerService.currentCustomer().legalEntityId;
        const productLineId = this.manager.productLine.productLineId;

        this.catalogApi.byProductLine(customerId, productLineId).map((response) => response.json()).subscribe((response) => {
            response.catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
            this.readyMixAdditionalServices = this.catalogs['ASC'];
            console.log('this: ',  this, )
        });

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

        // Disable contracts while fetching products
        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.contracts = true;
        });

        this.productsApi.top(
            this.manager.jobsite, 
            salesDocumentType, 
            this.manager.productLine, 
            this.manager.shippingCondition).subscribe((result) => {
                let topProducts = result.json().products;
                SpecificationsStepComponent.availableProducts = topProducts;

                // Set defaults value
                this.preProducts.forEach((item: PreProduct) => {
                    item.loadings.products = false;
                    if (topProducts.length > 0) {
                        item.setProduct(topProducts[0])
                        this.onCompleted.emit(true);
                    }
                    else {
                        item.setProduct(undefined);
                        this.onCompleted.emit(false);
                    }
                });
        });
    }

    getPlants() {
        if (this.manager.jobsite && this.manager.shippingCondition && this.manager.shippingCondition.shippingConditionId == 2) {
            this.plantApi.byCountryCodeAndRegionCode(
                this.manager.jobsite.address.countryCode.trim(),
                this.manager.jobsite.address.regionCode
            ).subscribe((response) => {
                SpecificationsStepComponent.plants = response.json().plants;
            });
        }
    }

    getContracts(productLineId) {
        const customerId = this.customerService.currentCustomer().legalEntityId;

        this.contractsApi.byProductTypeId(customerId, productLineId).subscribe((res) => {
            console.log('res: ', res.json())
        })
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
            const cashPayment = terms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeDesc === 'Cash';
            });

            // Find type Credit
            const creditPayment = terms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeDesc === 'Credit';
            });

            // Push to terms array
            cashPayment && uniqueTerms.push(cashPayment);
            creditPayment && uniqueTerms.push(creditPayment);
            SpecificationsStepComponent.availablePayments = uniqueTerms;

            let customerId = this.customerService.currentCustomer().legalEntityId;
            this.paymentTermsApi.getCashTerm(customerId).subscribe((result) => {
                let paymentTerms = result.json().paymentTerms;
                if (paymentTerms.length) {
                    SpecificationsStepComponent.availablePayments.push(paymentTerms[0]);
                }

                if (SpecificationsStepComponent.availablePayments.length) {
                    this.preProducts.forEach((item) => {
                        item.payment = SpecificationsStepComponent.availablePayments[0];
                    });
                }
            });
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
        this.catalogApi.byProductLine(customerId, this.manager.productLine.productLineId).subscribe((res: any) => {
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

    productChanged(preProduct: PreProduct) {
        preProduct.productChanged();
    }

    // TODO
    contractChanged(contract: any, preProduct: PreProduct) {
        preProduct.contractChanged();
    }

    add() {
        this.preProducts.push(new PreProduct(this.productsApi, this.manager));
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
    // Consts
    private MODE = DeliveryMode;

    // Props
    maneuvering: boolean = false;
    quantity: number = 1;
    date: any = new Date();
    time = "13:00";
    unit: any;
    payment: any;
    contract: any;
    product: any;
    plant: any;
    projectProfile: any = {};

    // Availables
    availableProducts = [];
    availableUnits = [];
    availableContracts = [];
    maneuveringAvailable: boolean = false;

    loadings = {
        products: false,
        contracts: true,
        projectProfiles: true,
        catalog: true,
        units: true,
    }

    constructor(private productsApi: ProductsApi, private manager: CreateOrderService) {
        let _ = SpecificationsStepComponent;

        this.payment = _.availablePayments[0];
        this.plant = _.availablePlants[0];

        if (_.availableProducts.length) {
            this.setProduct(_.availableProducts[0]);
            this.loadings.products = false;
        }
        else {
            this.loadings.products = true;
        }
    }

    setProduct(product: any) {
        this.product = product;
        this.productChanged();
    }

    productChanged() {
        if (!this.product) {
            this.loadings.products = true; // Disable
            return;
        }

        this.fetchContracts();
        this.fetchUnits();
        this.fetchManeuvering();
    }

    fetchContracts() {
        let SALES_DOCUMENT_TYPE = '1';
        this.loadings.contracts = true;

        this.productsApi.fetchContracts(
            this.manager.jobsite,
            SALES_DOCUMENT_TYPE,
            this.manager.productLine,
            this.manager.shippingCondition,
            this.product.product.productId
        ).subscribe((result) => {
            let contracts = result.json().products;
            console.log('contracts: ', contracts);
            this.availableContracts = contracts;

            if (contracts.length > 0) {
                this.availableContracts.unshift(undefined);
                this.loadings.contracts = false; 
            }
            else { this.loadings.contracts = true; } // Disable it if no contracts
        });
    }

    fetchUnits() {
        this.loadings.units = true;
        this.productsApi.units(this.product.product.productId).subscribe((result) => {
            let units = result.json().productUnitConversions;
            this.availableUnits = units;

            this.loadings.units = false;

            if (units.length > 0)
                this.unit = units[0];
        });
    }

    contractChanged() {
        if (this.contract) { this.fetchUnitsFromContract(); }
        else { this.fetchUnits(); }
    }

    fetchUnitsFromContract() {
        this.loadings.units = true;
        this.productsApi.units(this.contract.salesDocument.salesDocumentId).subscribe((result) => {
            let units = result.json().productUnitConversions;
            this.availableUnits = units;

            this.loadings.units = false;

            if (units.length > 0)
                this.unit = units[0];
        });
    }

    fetchManeuvering() {
        // Maneouvering additional service
        if (this.manager.shippingCondition.shippingConditionId === 1
            && (this.product.product.productLine.productLineId === 2 || this.product.product.productLine.productLineId === 3)
        ) {
            let area = this.manager.salesArea.find((a) => {
                let id = this.product.product.productLine.productLineId;
                return id === 2 ? a.salesArea.salesAreaId === 2 : a.salesArea.salesAreaId === 219;
            });

            // check if salesarea has maneouvering enabled
            if (area && area.maneuverable) {
                this.maneuveringAvailable = true;
            }
        }
    }
}