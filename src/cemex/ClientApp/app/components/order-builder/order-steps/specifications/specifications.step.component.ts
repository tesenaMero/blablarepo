import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { PaymentTermsApi } from '../../../../shared/services/api/payment-terms.service';
import { ProjectProfileApi, CatalogApi, PlantApi, ContractsApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { SearchProductService } from '../../../../shared/services/product-search.service';
import { DeliveryMode } from '../../../../models/delivery.model';
import { DashboardService } from '../../../../shared/services/dashboard.service'
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

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
    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    private loadings = {
        projectProfiles: true,
        catalog: true
    }

    // Subs
    productsSub: any;
    lockRequests: boolean = false;

    // Statics
    private shouldHidePayment = false;

    static availablePayments = [];
    get availablePayments() {
        return SpecificationsStepComponent.availablePayments;
    }

    static availableProducts = [];
    get availableProducts() {
        return SpecificationsStepComponent.availableProducts;
    }

    static additionalServices = [];
    get additionalServices() {
        return SpecificationsStepComponent.additionalServices;
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
        private searchProductService: SearchProductService,
        private dashboard: DashboardService
    ) {
        this.step.setEventsListener(this);
        this.step.canAdvance = () => this.canAdvance();
        this.step.onBeforeBack = () => this.onBeforeBack();
    }

    openProductSearch(preProduct: PreProduct) {
        this.searchProductService.fetchProductColors(this.manager.productLine.productLineId);

        // What the f is this
        this.searchProductService.searchedProduct.subscribe(product => {
            if (product) {
                let filteredProducts = SpecificationsStepComponent.availableProducts.filter((availableProducts) => {
                    return availableProducts.commercialCode === product.commercialCode;
                });
                if (filteredProducts.length) { preProduct.product = filteredProducts[0]; }
                else {
                    SpecificationsStepComponent.availableProducts.push(product);
                    preProduct.product = product;
                }
            }
        });
    }

    // Step Interfaces
    // ------------------------------------------------------
    onBeforeBack() {
        // Cancel needed requests and lock
        this.lockRequests = true;
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }
    }

    canAdvance(): boolean {
        this.manager.setProducts(this.preProducts);

        let advance = true;
        for (let preProduct of this.preProducts) {
            if (!preProduct.isValid()) {
                advance = false;
                return;
            }
        }

        if (!advance) { return; }

        return true;
    }

    onShowed() {
        // Unlock
        this.lockRequests = false;

        // Define validations for each preproduct already added
        this.preProducts.forEach((item: PreProduct) => {
            item.defineValidations();
        });

        // Add a pre product by default
        if (this.preProducts.length <= 0) { this.add(); }

        const customer = this.customerService.currentCustomer();
        const productLineId = this.manager.productLine.productLineId;

        this.shouldHidePayment = customer.countryCode.trim() == "US" || this.manager.productLine.productId == this.PRODUCT_LINES.Readymix;

        // Set loading state
        this.preProducts.forEach((item) => {
            item.loadings.products = true;
        });

        // Fetch products
        if (this.manager.productLine.productLineId == this.PRODUCT_LINES.Readymix) {
            this.fetchProductsReadyMix(this.manager.getSalesDocumentType());

        }
        else {
            this.fetchProducts(this.manager.getSalesDocumentType());
        }

        this.getAdditionalServices();
        this.getPaymentTerms();
        this.getProjectProfiles();
    }

    fetchProducts(salesDocumentType) {
        // Disable contracts while fetching products
        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.contracts = true;
        });

        // If locked (stepper is moving most likely) then dont do the call 
        if (this.lockRequests) { return; }

        this.productsSub = this.productsApi.top(
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

    fetchProductsReadyMix(salesDocumentType) {
        // Disable contracts while fetching products
        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.contracts = true;
        });

        // If locked (stepper is moving most likely) then dont do the call 
        if (this.lockRequests) { return; }

        this.productsSub = this.productsApi.top(
            this.manager.jobsite,
            salesDocumentType,
            this.manager.productLine,
            this.manager.shippingCondition,
            this.manager.purchaseOrder).subscribe((result) => {
                if (result.json().totalCount > 0) {
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
                }
                else {
                    this.fetchProducts(salesDocumentType)
                }
            });
    }

    getAdditionalServices() {
        this.catalogApi.byProductLine(this.customerService.currentCustomer().legalEntityId, this.manager.productLine.productLineId).map((response) => response.json()).subscribe((response) => {
            response.catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
            this.readyMixAdditionalServices = this.catalogs['ASC'];
        });
    }

    getPaymentTerms() {
        let paymentTermIds = '';

        this.manager.salesArea.map((area: any) => {
            if (area) {
                if (area.paymentTerm) {
                    paymentTermIds = paymentTermIds + area.paymentTerm.paymentTermId + ',';
                }
            }
        });

        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.payments = true;
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

            this.preProducts.forEach((item: PreProduct) => {
                item.availablePayments = SpecificationsStepComponent.availablePayments;

                // Pre select payemnt
                if (item.availablePayments) {
                    item.payment = item.availablePayments[0];
                    item.paymentChanged();
                }
            })

            if (!cashPayment) {
                let customerId = this.customerService.currentCustomer().legalEntityId;
                this.paymentTermsApi.getCashTerm(customerId).subscribe((result) => {
                    let paymentTerms = result.json().paymentTerms;
                    if (paymentTerms.length) {
                        SpecificationsStepComponent.availablePayments.push(paymentTerms[0]);
                    }

                    if (SpecificationsStepComponent.availablePayments.length) {
                        this.preProducts.forEach((item) => {
                            item.loadings.payments = false;
                        });
                    }
                });
            }
            else {
                this.preProducts.forEach((item) => {
                    item.loadings.payments = false;
                });
            }

        });
    }

    hasPayment(code, terms) {
        for (let p of terms) {
            if (p.paymentTermType.paymentTermTypeCode == code) {
                return true;
            }
        }

        return false;
    }

    getProjectProfiles() {
        const customerId = this.customerService.currentCustomer().legalEntityId;

        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.projectProfiles = true;
        });

        this.ProjectProfileApi.all(customerId).subscribe((response) => {
            const profiles = response.json().profiles;
            if (profiles) {
                SpecificationsStepComponent.projectProfiles = profiles;
            }

            this.preProducts.forEach((item: PreProduct) => {
                item.loadings.projectProfiles = false;
            });
        });

        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.catalogs = true;
        });

        this.catalogApi.byProductLine(customerId, this.manager.productLine.productLineId).subscribe((res: any) => {
            this.loadings.catalog = false;
            res.json().catalogs && res.json().catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
            this.preProducts.forEach((item: PreProduct) => {
                item.loadings.catalogs = false;
            });
        });
    }

    projectProfileChanged(preProduct: PreProduct, projectProfile) {
        // Prefill
        preProduct.projectProfile.profileId = projectProfile.profileId;
        preProduct.projectProfile.profileName = projectProfile.profileName;

        // Clone project object
        preProduct.projectProfile.project.projectProperties = JSON.parse(JSON.stringify(projectProfile.project.projectProperties));
    }

    onChangeDischargeTime(preProduct, index) {
        const entry = this.catalogs['DCT'][index];

        preProduct.projectProfile.project.projectProperties.dischargeTime = {
            dischargeTimeId: entry.entryId,
            timePerDischargeDesc: entry.entryDesc
        };
    }

    onChangeTransportMethod(preProduct, index) {
        const entry = this.catalogs['TPM'][index];

        preProduct.projectProfile.project.projectProperties.transportMethod = {
            transportMethodId: entry.entryId,
            transportMethodDesc: entry.entryDesc
        };
    }

    onChangeUnloadType(preProduct, index) {
        const entry = this.catalogs['ULT'][index];

        preProduct.projectProfile.project.projectProperties.unloadType = {
            unloadTypeId: entry.entryId,
            unloadTypeDesc: entry.entryDesc
        };
    }

    onChangePumpCapacity(preProduct, index) {
        const entry = this.catalogs['PCC'][index];

        preProduct.projectProfile.project.projectProperties.pumpCapacity = {
            pumpCapacityId: entry.entryId,
            pumpCapacityDesc: entry.entryDesc
        };
    }

    onChangeApplication(preProduct, index) {
        const entry = this.catalogs['ELM'][index];

        preProduct.projectProfile.project.projectProperties.element = {
            elementId: entry.entryId,
            elementDesc: entry.entryDesc
        };
    }

    onChangeLoadSize(preProduct, index) {
        const entry = this.catalogs['LSC'][index];

        preProduct.projectProfile.project.projectProperties.loadSize = {
            loadSizeId: entry.entryId,
            loadSizeDesc: entry.entryDesc
        };
    }

    onChangeTimePerLoad(preProduct, index) {
        const entry = this.catalogs['TPL'][index];

        preProduct.projectProfile.project.projectProperties.timePerLoad = {
            timePerLoadId: entry.entryId,
            timePerLoadDesc: entry.entryDesc
        };
    }

    changeAditionalService(preProduct: PreProduct, target, index) {
        if (target.checked) {
            preProduct.additionalServices.push(this.readyMixAdditionalServices[index]);
        } else {
            const idx = this.additionalServices.indexOf(this.readyMixAdditionalServices[index]);
            preProduct.additionalServices.splice(idx, 1);
        }
    }

    productChanged(preProduct: PreProduct) {
        preProduct.productChanged();
    }

    contractChanged(preProduct: PreProduct) {
        preProduct.contractChanged();
    }

    plantChanged(preProduct: PreProduct) {
        preProduct.plantChanged();
    }

    paymentChanged(preProduct: PreProduct) {
        preProduct.paymentChanged();
    }

    add() {
        this.preProducts.push(new PreProduct(
            this.productsApi,
            this.manager,
            this.paymentTermsApi,
            this.plantApi,
            this.customerService,
            this.dashboard
        ));
    }

    remove(index: any) {
        let product = this.preProducts[index];
        product.deleting = true;
        setTimeout(() => {
            this.preProducts.splice(index, 1);
        }, 400);
    }

    qty(product: PreProduct, toAdd: number) {
        if (this.isMXCustomer()) {
            if (product.quantity <= 1 && toAdd < 0) { return; }

            let newQty = product.quantity + toAdd;
            let maxCapacity = product.getMaximumCapacity() || Number.MAX_SAFE_INTEGER;

            if (newQty <= maxCapacity) {
                return product.quantity = newQty;
            }

            return this.dashboard.alertError("Maxiumum capacity limit reached", 10000);
        }
        else {
            if (product.quantity <= 1 && toAdd < 0) { return; }
            if (product.quantity >= Number.MAX_SAFE_INTEGER && toAdd > 0) { return; }
            product.quantity += toAdd;
        }
    }

    isMXCustomer() {
        return this.customerService.currentCustomer().countryCode.trim() == "MX";
    }
}

class PreProduct {
    // Consts
    private MODE = DeliveryMode;
    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    // Props
    maneuvering: boolean = false;
    quantity: number = 1;
    date: any = new Date();
    time = "13:00";
    unit: any;
    payment: any;
    contract: any;
    product: any;
    productBaseUnit: any;
    plant: any;
    projectProfile: any = {};
    templateProfile: any = {};
    additionalServices = [];

    // Availables
    availableProducts = [];
    availableUnits = [];
    availableContracts = [];
    availablePayments = [];
    availablePlants = [];
    maneuveringAvailable: boolean = false;

    loadings = {
        products: false,
        contracts: true,
        projectProfiles: true,
        catalogs: true,
        units: true,
        payments: true,
        plants: true
    }

    validations = {
        plant: { valid: false, mandatory: true, text: "Verify plant section" },
        contract: { valid: false, mandatory: true, text: "Verify contract section" },
        payment: { valid: false, mandatory: true, text: "Verify payment section" }
    }

    constructor(private productsApi: ProductsApi, private manager: CreateOrderService, private paymentTermsApi: PaymentTermsApi, private plantApi: PlantApi, private customerService: CustomerService, private dashboard: DashboardService) {
        // Conts
        const SSC = SpecificationsStepComponent;

        // Available products init
        if (SSC.availableProducts.length) {
            this.setProduct(SSC.availableProducts[0]);
            this.loadings.products = false;
        }
        else {
            this.loadings.products = true;
        }

        // Available payments init
        this.availablePayments = SSC.availablePayments;
        if (this.availablePayments.length > 0) {
            this.payment = this.availablePayments[0];
            this.paymentChanged();
            this.loadings.payments = false;
        }
        else {
            this.payment = undefined;
            this.loadings.payments = true;
        }

        // Available project profiles init
        if (SSC.projectProfiles.length) { this.loadings.projectProfiles = false; }
        else { this.loadings.projectProfiles = true; }

        // Available catalogs init
        if (SSC.catalogs) { this.loadings.catalogs = false; }
        else { this.loadings.catalogs = true; }

        // Define mandatories
        this.defineValidations();

        // Base project profile
        this.projectProfile = {
            project: {
                projectProperties: {
                }
            }
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

        // Call plants only on pickup
        if (this.manager.jobsite && this.manager.shippingCondition && this.manager.shippingCondition.shippingConditionId == this.MODE.Pickup) {
            this.getPlants();
        }
    }

    contractChanged() {
        if (this.contract) {
            this.validations.contract.valid = true;
            
            this.fetchUnitsFromContract();

            // If should get payment terms from contract
            if (this.contract.salesDocument.paymentTerm) {
                this.getContractPaymentTerm(this.contract.salesDocument.paymentTerm.paymentTermId);
            }
        }
        else {
            this.validations.contract.valid = false;
            this.fetchUnits();
            
            // Reset available payments
            this.availablePayments = SpecificationsStepComponent.availablePayments;
        }

        // TODO:
        // Set minimum quantity
        this.quantity = 1;

        // Plants from contract
        // this.productsApi.salesAreaFromContract(this.contract).subscribe((response) => {
        //     console.log(response.json());
        // });
    }

    plantChanged() {
        if (this.plant) { this.validations.plant.valid = true; }
        else { this.validations.plant.valid = false; }
    }

    paymentChanged() {
        if (this.payment) { this.validations.payment.valid = true; }
        else { this.validations.payment.valid = false; }
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

        // Fetch product base unit + alt units parallel
        Observable.forkJoin(
            this.productsApi.unit(this.product).map((result) => {
                this.product.unitOfMeasure = result.json();
            }),
            this.productsApi.units(this.product.product.productId).map((result) => {
                let units = result.json().productUnitConversions;
                this.availableUnits = units;

                this.loadings.units = false;

                if (units.length > 0)
                    this.unit = units[0];
            })
        ).subscribe((response) => {
            // Map product base unit with available units and map it
            let matchingUnit = this.availableUnits.find((unit) => {
                return unit.alternativeUnit.unitCode == this.product.unitOfMeasure.unitCode;
            });

            // Preselect it
            if (matchingUnit) { this.unit = matchingUnit; }
            else {
                if (this.availableUnits.length) { this.unit = this.availableUnits[0]; }
            }
        });
    }

    getContractPaymentTerm(termId: any) {
        this.loadings.payments = true;
        this.paymentTermsApi.getJobsiteById(termId).subscribe((result) => {
            const contractPaymentTerm = result.json().paymentTerms;
            this.availablePayments = contractPaymentTerm;

            if (this.availablePayments.length > 0) {
                this.loadings.payments = false;
            }
            else {
                this.payment = undefined;
                this.loadings.payments = true;
            }
        })
    }

    fetchUnitsFromContract() {
        if (this.contract.unitOfMeasure) {
            this.forkUnitsFromContracts();
        }
        else {
            this.productsApi.units(this.contract.salesDocument.salesDocumentId).subscribe((result) => {
                let units = result.json().productUnitConversions;
                this.availableUnits = units;
                if (units.length) {
                    this.unit = units[0];
                }
                else {
                    this.unit = undefined;
                }
            });
        }
    }

    private forkUnitsFromContracts() {
        this.loadings.units = true;

        // Fetch parallel units from contract + contract base unit
        Observable.forkJoin(
            this.productsApi.units(this.contract.salesDocument.salesDocumentId).map((result) => {
                let units = result.json().productUnitConversions;
                this.availableUnits = units;
            }),
            this.productsApi.unitByUnitOfMeasure(this.contract.unitOfMeasure).map((result) => {
                this.contract.unitOfMeasure = result.json();
                return result.json();
            })
        ).subscribe((response) => {
            // Match unit of measure and preselect it
            let matchingUnit = this.availableUnits.find((unit) => {
                return unit.alternativeUnit.unitCode == this.product.unitOfMeasure.unitCode;
            });

            // Preselect it and dont let the user change it
            if (matchingUnit) {
                this.unit = matchingUnit;
                this.loadings.units = true;
            }
            else {
                // Preselect first one and let the user change it
                if (this.availableUnits.length) {
                    this.unit = this.availableUnits[0];
                    this.loadings.units = false;
                }
                // No units available so disable it
                else {
                    this.loadings.units = true;
                }
            }
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

    getPlants() {
        let countryCode = this.manager.jobsite.address.countryCode || this.customerService.currentCustomer().countryCode;
        this.plantApi.byCountryCodeAndRegionCode(
            countryCode.trim(),
            this.manager.jobsite.address.regionCode,
            this.product.productId
        ).subscribe((response) => {
            this.availablePlants = response.json().plants;
            this.loadings.plants = false;
            this.plant = undefined;
            this.validations.plant.valid = false;
        }, error => {
            this.loadings.plants = false;
            this.plant = undefined;
            this.validations.plant.valid = false;
        });
    }

    getMaximumCapacity() {
        if (!this.contract) { return undefined; }
        const jobsite = this.manager.jobsite;
        const shippingConditionId = _.get(this.manager, 'shippingCondition.shippingConditionId');
        const isPickup = shippingConditionId === this.MODE.Pickup;
        //const salesArea = this.manager.salesArea.find((sa) => jobsite && jobsite.shipmentLocationId === jobsite.shipmentLocationId);

        const salesArea = _.get(this.manager, 'salesArea[0]');
        let maxJobsiteQty = undefined;
        const unlimited = undefined;
        maxJobsiteQty = _.get(salesArea, 'maximumLot.amount');

        if (this.contract) {
            const volume = _.get(this.contract, 'salesDocument.volume');
            if (volume) {
                const maxContractVolume = _.get(volume, 'total.quantity.amount');
                return maxContractVolume;
            } else {
                if (isPickup) {
                    return unlimited;
                } else {
                    return maxJobsiteQty;
                }
            }
        } else {
            if (isPickup) {
                return unlimited;
            } else {
                return maxJobsiteQty;
            }
        }
    }

    defineValidations() {
        // Readymix
        if (this.manager.productLine.productLineId == this.PRODUCT_LINES.Readymix) {
            this.validations.contract.mandatory = true;
            this.validations.plant.mandatory = false;
            return;
        }

        // Cement
        if (this.manager.productLine.productLineId != this.PRODUCT_LINES.Readymix) {
            this.validations.plant.mandatory = false;
            this.validations.contract.mandatory = false;
        }

        // Pickup && Mexico
        if (this.manager.shippingCondition.shippingConditionId == this.MODE.Pickup &&
            this.customerService.currentCustomer().countryCode.trim() == "MX") {
            this.validations.plant.mandatory = true;
            this.validations.contract.mandatory = false;
        }

        // Payment case
        if (this.shouldHidePayment()) {
            this.validations.payment.mandatory = false;
        }

    }

    shouldHidePayment() {
        return this.customerService.currentCustomer().countryCode.trim() == "US" || this.manager.productLine.productId == this.PRODUCT_LINES.Readymix
    }

    isValid(): boolean {
        let valid = true;
        for (let key in this.validations) {
            if (this.validations[key].mandatory) {
                if (!this.validations[key].valid) {
                    this.validations[key].showError = true;
                    this.dashboard.alertError(this.validations[key].text);
                    return false;
                }
            }
        }

        // Validate unit
        if (!this.unit) {
            this.dashboard.alertError("Verify unit section");
            return false;
        }

        return valid
    }
}