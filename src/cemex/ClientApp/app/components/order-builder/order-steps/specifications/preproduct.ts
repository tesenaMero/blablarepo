import { CustomerService } from '../../../../shared/services/customer.service';
import { ProjectProfileApi, PlantApi, ContractsApi, ProductsApi, PaymentTermsApi } from '../../../../shared/services/api';
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { SpecificationsStepComponent } from './specifications.step.component';
import { Validations } from '../../../../utils/validations';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

export class PreProduct {
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

    // Statics
    // static availablePayments = [];
    // static availableProducts = [];
    // static additionalServices = [];
    // static availablePlants = [];
    // static projectProfiles = [];
    // static catalogs = [];
    // static plants = [];

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
            // Disable stuff and remove loadings
            this.disableds.products = true;
            this.disableds.contracts = true;
            this.disableds.units = true;

            this.loadings.products = false;
            this.loadings.contracts = false;
            this.loadings.units = false;
            return;
        }

        this.fetchContracts();
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
                this.disableds.contracts = false;
                this.availableContracts.unshift(undefined);
            }
            else { this.disableds.contracts = true; } // Disable it if no contracts

            this.loadings.contracts = false;
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

                if (units.length > 0) {
                    this.disableds.units = false;
                    this.unit = units[0];
                }
                else { this.disableds.units = true; }

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
        this.loadings.plants = true;
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

    //convert to tons quantity selected
    convertToTons(qty): any{
        let factor = this.unit.numerator/this.unit.denominator;
        let convertion = qty*factor;
        if (this.unit) {            
            return convertion;
        } else {
            return;
        }
    }

    // Maximum capacity salesArea
    getMaximumCapacity() {
        const salesArea = _.get(this.manager, 'salesArea[0]');
        let maxJobsiteQty = undefined;
        const unlimited = undefined;
        if (salesArea) { return _.get(salesArea, 'maximumLot.amount'); }
        else { return unlimited; }
    }

    //Maximum capacity contract
    getContractBalance(){
        let balance = undefined;
        if (this.contract) {
            const volume = _.get(this.contract, 'salesDocument.volume');
            if (volume) {
                return _.get(volume, 'total.quantity.amount');
            }
            else {
                return balance;
            }
        }
        return balance;
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
            this.dashboard.alertError("Verify unit section");
            return false;
        }

        return valid
    }
}