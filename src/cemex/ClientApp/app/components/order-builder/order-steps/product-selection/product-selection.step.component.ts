import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ProductLineApi } from '../../../../shared/services/api'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { DeliveryMode } from '../../../../models/delivery.model'
import { CustomerService } from '../../../../shared/services/customer.service'
import { Validations } from '../../../../utils/validations';
import { TranslationService } from '../../../../shared/services/translation.service'

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.step.html',
    styleUrls: ['./product-selection.step.scss'],
    host: { 'class': 'w-100' }
})
export class ProductSelectionStepComponent {
    @Output() onCompleted = new EventEmitter<any>();
    private loading = true;
    private MODE = DeliveryMode;
    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    productLines = [];
    productLine: any;

    constructor(private api: ProductLineApi, private orderManager: CreateOrderService, private customerService: CustomerService, private t: TranslationService) {
        this.loading = true;
        this.api.all().subscribe((response) => {
            let productLines = response.json().productLines;

            let bagCement = this.getBagCement(productLines);
            let multiproduct = this.getMultiproduct(productLines)

            if (!Validations.isMexicoCustomer()) {
                multiproduct && productLines.splice(productLines.indexOf(multiproduct), 1);
            }
            else {
                // Bag cement
                if (bagCement || multiproduct) {
                    bagCement && productLines.splice(productLines.indexOf(bagCement), 1);
                    multiproduct && productLines.splice(productLines.indexOf(multiproduct), 1);

                    if (bagCement && multiproduct) {
                        let cementPackageMultiproducts = this.joinProductLines(bagCement, multiproduct, this.t.pt('views.product.selection.cement_package_multi'));
                        productLines.push(cementPackageMultiproducts);
                    }
                    else {
                        let cementPackageMultiproducts = this.joinProductLines({ productLineId: 2 }, { productLineId: 3 }, this.t.pt('views.product.selection.cement_package_multi'));
                        productLines.push(cementPackageMultiproducts);
                    }
                }
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

    select(product: any) {
        this.productLine = product;
        this.orderManager.selectProductLine(product);

        // Readymix case and Bulk Cement
        if (Validations.isReadyMix() || this.isBulkCementUSA()) {
            this.orderManager.shippingCondition = { shippingConditionCode: this.MODE.Delivery };
        }

        this.onCompleted.emit(product);
    }

    isBulkCementUSA(): boolean {
        return Validations.isBulkCement() && Validations.isUSACustomer();
    }

    isSelected(product: any) {
        return this.productLine == product;
    }
}