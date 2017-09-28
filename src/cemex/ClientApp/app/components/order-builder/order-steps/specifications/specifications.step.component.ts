import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ProductsApi, Api } from '../../../../shared/services/api'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { PaymentTermsApi } from '../../../../shared/services/api/payment-terms.service';
import { ProjectProfileApi, CatalogApi, PlantApi, ContractsApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { SearchProductService } from '../../../../shared/services/product-search.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Validations } from '../../../../utils/validations';
import { ModalService } from '../../../../shared/components/modal'
import { Observable } from 'rxjs/Observable';
import { PreProduct } from './preproduct'
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

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

    today: Date;

    // One box one preProduct
    private preProducts: Array<PreProduct> = [];

    // Consts
    private UTILS = Validations;

    private loadings = {
        projectProfiles: true,
        catalog: true
    }

    // Global
    // Only usd for readymix
    globalContract: any;

    // Subs
    productsSub: any;
    lockRequests: boolean = false;

    private shouldHidePayment = false;

    // Statics
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
        private dashboard: DashboardService,
        private modal: ModalService,
        private t: TranslationService
    ) {
        this.today = new Date();
        this.step.setEventsListener(this);
        this.step.canAdvance = () => this.canAdvance();
        this.step.onBeforeBack = () => this.onBeforeBack();
    }

    openProductSearch(preProduct: PreProduct) {
        this.searchProductService.fetchProductColors(this.manager.productLine.productLineId);
        this.modal.open('search-product');

        this.searchProductService.searchedProduct.subscribe(product => {
            if (product) {
                let filteredProducts = SpecificationsStepComponent.availableProducts.filter((availableProducts) => {
                    return availableProducts.commercialCode === product.commercialCode;
                });
                if (filteredProducts.length) {
                    preProduct.product = filteredProducts[0];
                    this.onCompleted.emit(true);
                }
                else {
                    SpecificationsStepComponent.availableProducts.push(product);
                    preProduct.product = product;
                    preProduct.productChanged();
                    this.onCompleted.emit(true);
                }
            }
        });
    }

    closeProductSearch() {
        this.modal.close('search-product');
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
        // Set loadings state
        this.preProducts.forEach((item: PreProduct) => {
            item.defineValidations();
            item.loadings.products = true;
            item.disableds.products = true;
        });

        // Add a pre product by default
        if (this.preProducts.length <= 0) { this.add(); }

        const customer = this.customerService.currentCustomer();
        const productLineId = this.manager.productLine.productLineId;

        this.shouldHidePayment = Validations.shouldHidePayment();

        // Fetch products
        if (Validations.isReadyMix()) {
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
            item.disableds.contracts = true;
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
                        item.productChanged();
                        this.onCompleted.emit(true);
                    }
                    else {
                        item.setProduct(undefined);
                        item.productChanged();
                        this.onCompleted.emit(false);
                    }

                    // Enable product selection anyways
                    item.disableds.products = false;
                });
            }
            );
    }

    fetchProductsReadyMix(salesDocumentType) {
        // Disable contracts while fetching products
        this.preProducts.forEach((item: PreProduct) => {
            item.disableds.contracts = true;
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
                            item.productChanged();
                            this.onCompleted.emit(true);
                        }
                        else {
                            item.setProduct(undefined);
                            item.productChanged();
                            this.onCompleted.emit(false);
                        }

                        // Enable product selection anyways
                        item.disableds.products = false;
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
        // Set payment loading state
        this.preProducts.forEach((item: PreProduct) => {
            item.loadings.payments = true;
            item.disableds.payments = true;
        });

        let paymentTermIds = '';
        this.manager.salesArea.map((area: any) => {
            if (area) {
                if (area.paymentTerm) {
                    paymentTermIds = paymentTermIds + area.paymentTerm.paymentTermId + ',';
                }
            }
        });

        this.paymentTermsApi.getJobsitePaymentTerms(paymentTermIds).subscribe((result) => {
            let paymentTerms = result.json().paymentTerms;

            const cash = paymentTerms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeCode === 'CASH';
            });

            const credit = paymentTerms.find((term: any) => {
                return term.paymentTermType.paymentTermTypeCode === 'CREDIT';
            });

            // If usa set only credit and return
            if (Validations.isUSACustomer()) {
                if (credit) {
                    this.preProducts.forEach((item: PreProduct) => {
                        item.payment = credit;
                        item.paymentChanged();
                    })
                }
                else {
                    this.dashboard.alertError("No payment type available for this jobsite");
                }
                return;
            }
            
            // If theres no cash, fetch it manually
            if (!cash) {
                let customerId = this.customerService.currentCustomer().legalEntityId;
                this.paymentTermsApi.getCashTerm(customerId).subscribe((result) => {
                    let cashTerm = result.json().paymentTerms;
                    
                    const singleCash = cashTerm.find((term: any) => {
                        return term.paymentTermType.paymentTermTypeCode === 'CASH';
                    });

                    // If cash founded, add it
                    if (singleCash) { paymentTerms.push(singleCash); }

                    // Set default payment terms for preproducts
                    SpecificationsStepComponent.availablePayments = paymentTerms;

                    // Set available payments and loading state
                    this.preProducts.forEach((item: PreProduct) => {
                        item.availablePayments = paymentTerms;
                        // In the case where payment is not showed to the user select credit by default
                        // If there is no credit try to select whatever lol
                        if (Validations.shouldHidePayment()) {
                            if (credit) {
                                item.payment = credit;
                                item.paymentChanged();
                            }
                            else if (paymentTerms.length) {
                                item.payment = paymentTerms[0];
                                item.paymentChanged();
                            }
                        }
                        else {
                            item.payment = undefined;
                            item.paymentChanged();
                        }

                        item.loadings.payments = false;
                        item.disableds.payments = false;
                    });
                });
            }
            else {
                // Set default payment terms for preproducts
                SpecificationsStepComponent.availablePayments = paymentTerms;

                // Set available payments and loading state
                this.preProducts.forEach((item: PreProduct) => {
                    item.availablePayments = paymentTerms;

                    // In the case where payment is not showed to the user select credit by default
                    // If there is no credit try to select whatever lol
                    if (Validations.shouldHidePayment()) {
                        if (credit) {
                            item.payment = credit;
                            item.paymentChanged();
                        }
                        else if (paymentTerms.length) {
                            item.payment = paymentTerms[0];
                            item.paymentChanged();
                        }
                    }
                    else {
                        item.payment = undefined;
                        item.paymentChanged();
                    }

                    item.loadings.payments = false;
                    item.disableds.payments = false;
                });
            }
        });
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
        const readymixCase = Validations.isReadyMix() && this.globalContract;
        if (readymixCase) {
            // Do not fetch contracts, just add product
            preProduct.productChanged(false);
        }
        else {
            preProduct.productChanged();
        }
    }

    contractChanged(preProduct: PreProduct) {
        // Readymix scenario
        // All products should be using the same contract
        if (Validations.isReadyMix()) {
            this.globalContract = preProduct.contract;
            this.preProducts.forEach((item: PreProduct, index) => {
                item.contract = this.globalContract;
                item.contractChanged();

                if (this.globalContract) {
                    // Valid contract selected
                    if (index > 0) { item.disableds.contracts = true; }
                }
                else {
                    // Contract unselected
                    item.disableds.contracts = false;
                }
            });
        }

        // Normal scenario
        else {
            preProduct.contractChanged();
        }
    }

    plantChanged(preProduct: PreProduct) {
        preProduct.plantChanged();
    }

    paymentChanged(preProduct: PreProduct) {
        preProduct.paymentChanged();
    }

    add() {
        const shouldFetchContracts = !(Validations.isReadyMix() && this.globalContract);
        let preProduct = new PreProduct(
            this.productsApi,
            this.manager,
            this.paymentTermsApi,
            this.plantApi,
            this.customerService,
            this.dashboard,
            this.t,
            shouldFetchContracts
        )

        // Readymix case where everything has to be from the same contract
        if (Validations.isReadyMix() && this.globalContract) {
            preProduct.contract = this.globalContract;
            preProduct.disableds.contracts = true;

            if (this.preProducts.length) {
                // Set the same product as initial so ensure they belong to the same contract
                preProduct.product = this.preProducts[0].product;
                preProduct.availableContracts = this.preProducts[0].availableContracts;
            }
        }

        this.preProducts.push(preProduct);
    }

    remove(index: any) {
        let product = this.preProducts[index];
        product.deleting = true;
        setTimeout(() => {
            this.preProducts.splice(index, 1);

            // Readymix case when all contracts should be the same.
            // Case when the first product is removed
            if (Validations.isReadyMix() && this.preProducts.length) {
                if (this.preProducts[0].disableds.contracts) {
                    this.preProducts[0].disableds.contracts = false;
                }
            }
        }, 400);
    }

    qty(product: PreProduct, toAdd: number) {
        if (product.quantity <= 1 && toAdd < 0) { return; }
        if (product.quantity >= Number.MAX_SAFE_INTEGER && toAdd > 0) { return; }
        product.quantity += toAdd;
        return;
        // if (this.isMXCustomer()) {
        //     if (product.quantity <= 1 && toAdd < 0) { return; }
        //     const isDelivery = Validations.isDelivery();
        //     let conversion = product.convertToTons(product.quantity + toAdd);

        //     let newQty = product.quantity + toAdd;
        //     let contractBalance = product.getContractBalance(); //remaining of contract
        //     let maxCapacitySalesArea = product.getMaximumCapacity();

        //     if (contractBalance === undefined) {
        //         if (isDelivery) {
        //             if (((this.manager.productLine.productLineId == 2) || (this.manager.productLine.productLineId == 1)) && (conversion <= maxCapacitySalesArea)) {
        //                 return product.quantity = newQty;
        //             }
        //             else {
        //                 if (conversion <= maxCapacitySalesArea) {
        //                     return product.quantity = newQty;
        //                 }
        //             }
        //         }
        //         else {
        //             if (conversion <= maxCapacitySalesArea) {
        //                 return product.quantity = newQty;
        //             }
        //         }
        //     }
        //     else {
        //         if (conversion > contractBalance) {
        //             return this.dashboard.alertError(this.t.pt('views.specifications.maximum_capacity_reached'), 10000);
        //         }
        //         if (!isDelivery) {
        //             if (conversion <= maxCapacitySalesArea) {
        //                 return product.quantity = newQty;
        //             }
        //         }
        //         else {
        //             if ((conversion <= maxCapacitySalesArea)) {
        //                 return product.quantity = newQty;
        //             }
        //         }
        //     }
        //     if (conversion <= maxCapacitySalesArea) {
        //         return product.quantity = newQty;
        //     }

        //     return this.dashboard.alertError(this.t.pt('views.specifications.maximum_capacity_reached'), 10000);
        // }
        // else {
        //     if (product.quantity <= 1 && toAdd < 0) { return; }
        //     if (product.quantity >= Number.MAX_SAFE_INTEGER && toAdd > 0) { return; }
        //     product.quantity += toAdd;
        // }
    }

    todayStr() {
        return new Date().toJSON().split('T')[0];
    }

    isMXCustomer() {
        return this.customerService.currentCustomer().countryCode.trim() == "MX";
    }
}