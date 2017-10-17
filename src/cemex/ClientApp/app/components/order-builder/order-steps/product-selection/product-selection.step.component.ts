import { Component, Output, EventEmitter } from '@angular/core';
import { ProductLineApi } from '../../../../shared/services/api'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { DeliveryMode } from '../../../../models/delivery.model';
import { Validations } from '../../../../utils/validations';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { Step, StepEventsListener } from '../../../../shared/components/stepper/';

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.step.html',
    styleUrls: ['./product-selection.step.scss'],
    host: { 'class': 'w-100' }
})
export class ProductSelectionStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    private loading = true;
    private MODE = DeliveryMode;

    productLines = [];
    productLine: any;

    constructor(
        private step: Step,
        private api: ProductLineApi, 
        private orderManager: CreateOrderService,
        private t: TranslationService) {

        // Interface
        this.step.setEventsListener(this);
            
        // Init product lines from api
        this.initProductLines();
    }

    onShowed() {
        if (this.productLine) {
            this.onCompleted.emit(this.productLine);
        }
        else {
            this.onCompleted.emit(false);
        }
    }

    initProductLines() {
        this.loading = true;
        this.api.all().subscribe((response) => {
            let productLines = response.json().productLines;

            let bagCement = this.getBagCement(productLines);
            let multiproduct = this.getMultiproduct(productLines);

            if (!Validations.isMexicoCustomer()) {
                multiproduct && productLines.splice(productLines.indexOf(multiproduct), 1);
            }
            else if (bagCement && multiproduct) {
                bagCement && productLines.splice(productLines.indexOf(bagCement), 1);
                multiproduct && productLines.splice(productLines.indexOf(multiproduct), 1);
                
                let cementPackageMultiproducts = this.joinProductLines(bagCement,
                    multiproduct,
                    this.t.pt('views.product.selection.cement_package_multi')
                );
                
                productLines.push(cementPackageMultiproducts);
            }

            this.productLines = productLines;
            this.loading = false;
        }, error => {
            this.loading = false;
        });
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
        if (this.orderManager.productLine && this.orderManager.productLine.productLineId != productLine.productLineId ) { // Clean manager
            this.orderManager.resetOrder();
        }
        this.productLine = productLine;
        this.orderManager.selectProductLine(productLine);

        // Readymix case and Bulk Cement
        if (Validations.isReadyMix() || this.isBulkCementUSA()) {
            this.orderManager.shippingCondition = { shippingConditionCode: this.MODE.Delivery };
        }

        this.onCompleted.emit(productLine);
    }

    isBulkCementUSA(): boolean {
        return Validations.isBulkCement() && Validations.isUSACustomer();
    }

    isSelected(product: any) {
        return this.productLine == product;
    }
}