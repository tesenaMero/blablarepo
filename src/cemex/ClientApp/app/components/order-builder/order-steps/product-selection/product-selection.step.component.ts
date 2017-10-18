import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ProductLineApi } from '../../../../shared/services/api'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { DeliveryMode } from '../../../../models/delivery.model'
import { CustomerService } from '../../../../shared/services/customer.service'
import { Validations } from '../../../../utils/validations';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'

import * as _ from 'lodash';

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.step.html',
    styleUrls: ['./product-selection.step.scss'],
    host: { 'class': 'w-100' }
})
export class ProductSelectionStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    private MODE = DeliveryMode;

    private productLines = [];
    private productLine: any;

    private language: string;
    
    private loading = true;
    private semaphoreLock: boolean = false;

    constructor(
        @Inject(Step) private step: Step,
        private api: ProductLineApi,
        private manager: CreateOrderService,
        private customerService: CustomerService,
        private t: TranslationService) {

        // Interface
        this.step.setEventsListener(this);

        // Fetch product lines if not locked
        this.fetchProductLines();

        // Listen to lang change
        this.t.localeData.subscribe((response) => {
            // If its different from the already selected language
            if (this.language != response.lang) {
                this.language = response.lang;
                // Fetch product lines if not locked
                this.fetchProductLines();
            }
        })
    }

    onShowed() {
        if (this.productLine) {
            this.onCompleted.emit(this.productLine);
        }
        else {
            this.onCompleted.emit(false);
        }
    }

    fetchProductLines() {
        if (this.semaphoreLock) { return; }

        this.loading = true;
        this.semaphoreLock = true;
        this.api.all().subscribe((response) => {
            let productLines = response.json().productLines;
            const bagCement = this.getBagCement(productLines);
            const multiproduct = this.getMultiproduct(productLines)

            this.initProductLines(productLines, bagCement, multiproduct);

            this.loading = false;
            this.semaphoreLock = false;
        }, error => {
            this.loading = false;
            this.semaphoreLock = false;
        });
    }

    initProductLines(productLines: any[], bagCement: any, multiproduct: any) {
        if (!Validations.isMexicoCustomer()) {
            // Remove multiproduct in mexico
            multiproduct && this.removeItem(multiproduct, productLines);
        }
        else if (bagCement && multiproduct) {
            bagCement && this.removeItem(bagCement, productLines);
            multiproduct && this.removeItem(multiproduct, productLines);

            const packageMultiproductName = this.t.pt('views.product.selection.cement_package_multi');
            const cementPackageMultiproducts = this.joinProductLines(bagCement, multiproduct, packageMultiproductName);

            // Add new product line manually
            productLines.push(cementPackageMultiproducts);
        }

        this.productLines = productLines;
    }

    removeItem(item, arr: any[]) {
        arr.splice(arr.indexOf(item), 1);
    }

    shouldHide(productLine: any): boolean {
        return productLine.productLineId == 5;
    }

    getBagCement(productLines: any[]) {
        return productLines.filter((x) => { return x.productLineId == 2; })[0];
    }

    getMultiproduct(productLines: any[]) {
        return productLines.filter((x) => { return x.productLineId == 3; })[0];
    }

    joinProductLines(a, b, newName) {
        return { productLineDesc: newName, productLineId: a.productLineId + "," + b.productLineId }
    }

    select(productLine: any) {
        if (this.manager.productLine && this.manager.productLine.productLineId != productLine.productLineId) { // Clean manager
            this.manager.resetOrder();
        }
        this.productLine = productLine;
        this.manager.selectProductLine(productLine);

        // Readymix case and Bulk Cement
        if (Validations.isReadyMix() || this.isBulkCementUSA()) {
            this.manager.shippingCondition = { shippingConditionCode: this.MODE.Delivery };
        }

        this.onCompleted.emit(productLine);
    }

    isBulkCementUSA(): boolean {
        return Validations.isBulkCement() && Validations.isUSACustomer();
    }

    isSelected(productLine: any) {
        return _.get(this.manager, 'productLine.productLineCode') === _.get(productLine, 'productLineCode');
    }
}