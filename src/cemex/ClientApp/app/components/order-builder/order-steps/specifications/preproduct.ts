import { CustomerService } from '../../../../shared/services/customer.service';
import { ProjectProfileApi, PlantApi, ContractsApi, ProductsApi, PaymentTermsApi } from '../../../../shared/services/api';
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { SpecificationsStepComponent } from './specifications.step.component';
import { Validations } from '../../../../utils/validations';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

import * as _ from 'lodash';

export class PreProduct {
    // View states
    deleting: boolean = false;

    // Props
    maneuvering: boolean = false;
    quantity: number = 1;
    newValue: number = 1;
    date: any = new Date();
    time = new Date();
    unit: any;
    payment: any;
    contract: any;
    maxCapacity: any;
    product: any;
    productBaseUnit: any;
    plant: any;
    projectProfile: any = {};
    templateProfile: any = {};
    additionalServices = [];
    maximumCapacity: any;

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

    disableds = {
        products: false,
        contracts: true,
        projectProfiles: true,
        catalogs: true,
        units: true,
        payments: true,
        plants: true,
        quantity: true
    }

    validations = {
        plant: { valid: false, mandatory: true, text: this.t.pt('views.specifications.verify_plant') },
        contract: { valid: false, mandatory: true, text: this.t.pt('views.specifications.verify_contract') },
        payment: { valid: false, mandatory: true, text: this.t.pt('views.specifications.verify_payment') },
        product: { valid: false, mandatory: true, text: this.t.pt('views.specifications.verify_products_selected') },
        maxCapacity: { valid: true, mandatory: true, text: this.t.pt('views.specifications.maximum_capacity_reached') },
    }

    constructor(private productsApi: ProductsApi, private manager: CreateOrderService, private paymentTermsApi: PaymentTermsApi, private plantApi: PlantApi, private customerService: CustomerService, private dashboard: DashboardService, private t: TranslationService, private shouldFetchContracts?: boolean, private templateProduct?: any) {
        // Optionals
        if (shouldFetchContracts == undefined) { shouldFetchContracts = true }

        // Max capacity
        this.maximumCapacity = this.getMaximumCapacity();

        // Conts
        const SSC = SpecificationsStepComponent;

        // Available products init
        // -------------------------------------------------------
        if (SSC.availableProducts.length && !this.product) {
            //this.setProduct(SSC.availableProducts[0], shouldFetchContracts);
            this.setProduct(SSC.availableProducts[0]);
            this.loadings.products = false;
        }
        else {
            this.loadings.products = true;
        }

        // Available payments init
        // -------------------------------------------------------
        this.loadings.payments = true;
        this.disableds.payments = true;
        this.availablePayments = SSC.availablePayments;
        if (this.availablePayments.length === 1) {
            this.payment = this.availablePayments[0];
            this.disableds.payments = false;
        }
        else if (this.availablePayments.length > 0) {
            this.payment = undefined;
            this.disableds.payments = false;
        }
        else {
            this.payment = undefined;
            this.disableds.payments = true;
        }
        this.loadings.payments = false;
        this.paymentChanged();

        // Available project profiles init
        // -------------------------------------------------------
        if (SSC.projectProfiles.length) { this.loadings.projectProfiles = false; }
        else { this.loadings.projectProfiles = true; }

        // Available catalogs init
        // -------------------------------------------------------
        if (SSC.catalogs) { this.loadings.catalogs = false; }
        else { this.loadings.catalogs = true; }

        // Define mandatories
        // -------------------------------------------------------
        this.defineValidations();

        // Base project profile
        // -------------------------------------------------------
        this.projectProfile = {
            project: {
                projectProperties: {
                }
            }
        }

        if (Validations.isReadyMix()) {
            this.projectProfile.project.projectProperties.kicker = false;
        }
    }

    setProducts(products: any[]) {
        if (products.length && this.product) {
            // Try to preselect product
            let matchedProduct = products.find(item => {
                return item.commercialCode == this.product.commercialCode
            });

            this.setProduct(matchedProduct);
        }
        else if (products.length) {
            this.setProduct(products[0]);
        }
        else {
            this.setProduct(undefined);
        }
    }

    setProduct(product: any, shouldFetchContracts?: boolean) {
        // Optionals
        if (shouldFetchContracts == undefined) { shouldFetchContracts = true }

        this.product = product;
        this.productChanged(shouldFetchContracts);
    }

    productChanged(shouldFetchContracts?: boolean) {
        // Optionals
        if (shouldFetchContracts == undefined) { shouldFetchContracts = true }

        if (!this.product) {
            // Disable stuff and remove loadings
            this.disableds.products = true;
            this.disableds.contracts = true;
            this.disableds.units = true;

            this.loadings.products = false;
            this.loadings.contracts = false;
            this.loadings.units = false;

            this.validations.product.valid = false;
            return;
        }
        else {
            this.validations.product.valid = true;
            this.loadings.products = false;
        }

        if (shouldFetchContracts) {
            this.fetchContracts();
        }
        else {
            this.loadings.contracts = false;
        }

        this.fetchUnits();
        this.fetchManeuvering();

        // Call plants only on pickup
        if (Validations.isPickup()) {
            this.getPlants();
        }
    }

    contractChanged() {
        if (this.contract) {
            this.validations.contract.valid = true;

            this.fetchUnitsFromContract();

            // If should get payment terms from contract
            if (this.contract.salesDocument.paymentTerm && this.contract.salesDocument.paymentTerm.checkPaymentTerm == true) {
                this.getContractPaymentTerm(this.contract.salesDocument.paymentTerm.paymentTermId);
            }
            else {
                // Reset available payments
                this.availablePayments = SpecificationsStepComponent.availablePayments;
            }
        }
        else {
            this.validations.contract.valid = false;
            this.fetchUnits();

            // Reset available payments
            this.availablePayments = SpecificationsStepComponent.availablePayments;
            this.payment = SpecificationsStepComponent.availablePayments[0];
        }

        // TODO:
        // Set minimum quantity
        // this.quantity = 1;
    }

    quantityGood() {
        this.validations.maxCapacity.valid = true;
    }

    quantityBad() {
        this.validations.maxCapacity.valid = false;
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
            this.product.product.productId,
            this.getShippingCondition()
        ).subscribe((result) => {
            let contracts = result.json().products;

            // Set contracts and add default
            this.availableContracts = contracts;
            this.availableContracts.unshift(undefined);

            if (this.availableContracts.length > 0) {
                this.disableds.contracts = false;

                let matchContract = undefined;
                if (this.contract) {
                    // Try to match
                    try {
                        matchContract = this.availableContracts.find((item) => {
                            return item.salesDocument.salesDocumentCode == this.contract.salesDocument.salesDocumentCode
                        });
                    }
                    catch (ex) {
                        matchContract = undefined;
                    }
                }
                
                this.contract = matchContract
            }
            else {
                // Disable it if no contracts
                this.disableds.contracts = true;
                this.contract = this.availableContracts[0];
            }

            this.contractChanged();
            this.loadings.contracts = false;
        });
    }

    getShippingCondition() {
        if (Validations.isUSACustomer() && Validations.isPickup()) {
            return undefined;
        }
        else {
            return this.manager.shippingCondition
        }
    }

    fetchUnits() {
        this.loadings.units = true;
        this.disableds.units = true;
        this.disableds.quantity = true;

        // Fetch product base unit + alt units parallel
        Observable.forkJoin(
            this.productsApi.unit(this.product).map((result) => {
                this.product.unitOfMeasure = result.json();
            }),
            this.productsApi.units(this.product.product.productId).map((result) => {
                let units = result.json().productUnitConversions;
                this.availableUnits = units;
                this.product.availableUnits = units;

                if (units.length > 0) {
                    this.disableds.units = false;
                    this.disableds.quantity = false;
                    this.unit = units[0];
                }
                else {
                    this.disableds.units = true;
                    this.disableds.quantity = true;
                }

                this.loadings.units = false;

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
                else { this.unit = undefined; }
            }
        });
    }

    getContractPaymentTerm(termId: any) {
        this.loadings.payments = true;
        this.disableds.payments = true;
        this.paymentTermsApi.getJobsiteById(termId).subscribe((result) => {
            const contractPaymentTerm = result.json().paymentTerms;
            this.availablePayments = contractPaymentTerm;

            if (this.availablePayments.length === 1) {
                this.payment = this.availablePayments[0];
                this.disableds.payments = false;
            }
            else if (this.availablePayments.length > 1) {
                this.payment = undefined;
                this.disableds.payments = false;
            }
            else {
                this.payment = undefined;
                this.disableds.payments = true;
            }

            this.loadings.payments = false;
            this.paymentChanged();
        })
    }

    fetchUnitsFromContract() {
        if (this.contract.unitOfMeasure) {
            // Fetch base unit and units from contracts and preselect
            this.forkUnitsFromContracts();
        }
        else {
            this.disableds.units = true;
            this.loadings.units = true;
            this.disableds.quantity = true;
            this.productsApi.units(this.contract.salesDocument.salesDocumentId).subscribe((result) => {
                let units = result.json().productUnitConversions;
                if (units) { this.availableUnits = units; }
                else { this.availableUnits = this.product.availableUnits; }

                if (units.length) {
                    this.unit = units[0];
                    this.disableds.units = false;
                    this.disableds.quantity = false;
                }
                else {
                    this.unit = undefined;
                }

                this.loadings.units = false;
            });
        }
    }

    private forkUnitsFromContracts() {
        this.loadings.units = true;
        this.disableds.units = true;
        this.disableds.quantity = true;

        // Fetch parallel units from contract + contract base unit
        Observable.forkJoin(
            this.productsApi.units(this.contract.salesDocument.salesDocumentId).map((result) => {
                let units = result.json().productUnitConversions;
                if (units.length) { this.availableUnits = units; }
                else { this.availableUnits = this.product.availableUnits; }
            }),
            this.productsApi.unitByUnitOfMeasure(this.contract.unitOfMeasure).map((result) => {
                this.contract.unitOfMeasure = result.json();
                return result.json();
            })
        ).subscribe((response) => {
            if (Validations.isReadyMix()) {
                this.unit = {};
                this.unit.alternativeUnit = this.contract.unitOfMeasure;
                this.disableds.units = true;
                this.disableds.quantity = false;
                this.loadings.units = false;
                return;
            }

            // Match unit of measure and preselect it
            let matchingUnit = this.availableUnits.find((unit) => {
                return unit.alternativeUnit.unitCode == this.product.unitOfMeasure.unitCode;
            });

            this.loadings.units = false;

            // Preselect it and dont let the user change it
            if (matchingUnit) {
                this.unit = matchingUnit;
                this.disableds.units = true;
                this.disableds.quantity = false;
            }
            else {
                // Preselect first one and let the user change it
                if (this.availableUnits.length) {
                    this.unit = this.availableUnits[0];
                    this.disableds.quantity = false;
                }
                // No units available so disable it
                else {
                    this.dashboard.alertError("No units available for this contract", 8000);
                    this.unit = undefined;
                    this.disableds.units = true;
                    this.disableds.quantity = true;
                }
            }
        });
    }

    // TODO: define product lines 2 and 3
    fetchManeuvering() {
        this.maneuveringAvailable = false;
        // Maneouvering additional service
        if (Validations.isDelivery() &&
            (this.product.product.productLine.productLineId === 2 || this.product.product.productLine.productLineId === 3)) {

            let area = this.manager.salesArea.find((a) => {
                let id = this.product.product.productLine.productLineId;

                return id === 2 ? a.salesArea.divisionCode === '02' : a.salesArea.divisionCode === '09';
            });

            // check if salesarea has maneouvering enabled
            if (area && area.maneuverable) {
                this.maneuveringAvailable = true;
            }
        }
    }

    getPlants() {
        let countryCode = this.manager.jobsite.address.countryCode || this.customerService.currentCustomer().countryCode;
        this.loadings.plants = true;
        this.plantApi.byCountryCodeAndRegionCode(
            countryCode.trim(),
            this.manager.jobsite.address.regionCode,
            this.product.product.productId
        ).subscribe((response) => {
            if (response.status == 200) {
                this.availablePlants = response.json().plants;
                this.loadings.plants = false;

                if (this.availablePlants.length === 1) { this.plant = this.availablePlants[0]; }
                else { this.plant = undefined; }

                this.plantChanged();
            }
        }, error => {
            this.loadings.plants = false;
            this.plant = undefined;
            this.validations.plant.valid = false;
        });
    }

    // Convert to tons quantity selected
    convertToTons(qty): any {
        if (this.unit === undefined) {
            return qty;
        }

        let factor = this.unit.numerator / this.unit.denominator;
        let convertion = qty * factor;
        return convertion || undefined;
    }

    // Maximum capacity salesArea
    private getMaximumCapacity() {
        const salesAreaArray = _.get(this.manager, 'salesArea');
        let salesArea = _.get(this.manager, 'salesArea[0]');
        if (salesAreaArray && salesAreaArray.length > 1) {
            salesArea = salesAreaArray.find(sa => {
                return _.get(sa, 'salesArea.divisionCode') == "02";
            })
        }

        if (salesArea) { return _.get(salesArea, 'maximumLot.amount'); }
        else { return undefined; }
    }

    // Maximum capacity contract
    getContractBalance() {
        if (this.contract) {
            const volume = _.get(this.contract, 'salesDocument.volume');
            if (volume) {
                return _.get(volume, 'total.quantity.amount');
            }
        }
        return undefined;
    }

    // Minimum capacity salesArea
    getMinimumCapacity() {
        const salesArea = _.get(this.manager, 'salesArea[0]');
        let maxJobsiteQty = undefined;
        const unlimited = undefined;
        if (salesArea) { return _.get(salesArea, 'minimumLot.amount'); }
        else { return unlimited; }
    }

    defineValidations() {
        // Readymix
        if (Validations.isReadyMix()) {
            this.validations.contract.mandatory = true;
            this.validations.plant.mandatory = false;
            return;
        }

        // Cement
        if (Validations.isCement()) {
            this.validations.plant.mandatory = false;
            this.validations.contract.mandatory = false;
        }

        // Pickup && Mexico
        if (Validations.isPickup() && Validations.isMexicoCustomer()) {
            this.validations.plant.mandatory = true;
            this.validations.contract.mandatory = false;
        }

        // Payment case
        if (this.shouldHidePayment()) {
            this.validations.payment.mandatory = false;
        }

        if (Validations.isMexicoCustomer() && Validations.isCement() && Validations.isDelivery()) {
            this.validations.maxCapacity.mandatory = true;
        }

    }

    shouldHidePayment() {
        return Validations.isUSACustomer() || Validations.isReadyMix();
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
            this.dashboard.alertError(this.t.pt('views.specifications.verify_unit'));
            return false;
        }

        return valid
    }
}