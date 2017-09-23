import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ProductLineApi } from '../../../../shared/services/api'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { DeliveryMode } from '../../../../models/delivery.model'
import { CustomerService } from '../../../../shared/services/customer.service'

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.step.html',
    styleUrls: ['./product-selection.step.scss'],
    host: { 'class': 'w-100' }
})
export class ProductSelectionStepComponent {
    @Output() onCompleted = new EventEmitter<any>();
    private MODE = DeliveryMode;
    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    productLines = [];
    productLine: any;

    constructor(private api: ProductLineApi, private orderManager: CreateOrderService, private customerService: CustomerService) {
        this.api.all().subscribe((response) => {
            let productLines = response.json().productLines;

            let bagCement = this.getBagCement(productLines);
            let multiproduct = this.getMultiproduct(productLines)

            if (!this.isMexico()) {
                multiproduct && productLines.splice(productLines.indexOf(multiproduct), 1);
            }
            else {
                // Bag cement
                if (bagCement || multiproduct) {
                    bagCement && productLines.splice(productLines.indexOf(bagCement), 1);
                    multiproduct && productLines.splice(productLines.indexOf(multiproduct), 1);

                    if (bagCement && multiproduct) {
                        let cementPackageMultiproducts = this.joinProductLines(bagCement, multiproduct, "Cement Package Multiproducts");
                        productLines.push(cementPackageMultiproducts);
                    }
                    else {
                        let cementPackageMultiproducts = this.joinProductLines({ productLineId: 2 }, { productLineId: 3 }, "Cement Package Multiproducts");
                        productLines.push(cementPackageMultiproducts);
                    }
                }
            }

            this.productLines = productLines.filter((x) => { return x.productLineId != 5; });
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
        if (this.productLine.productLineId == this.PRODUCT_LINES.Readymix || this.isBulkCementUSA()) {
            this.orderManager.shippingCondition = { shippingConditionId: this.MODE.Delivery };
        }

        this.onCompleted.emit(product);
    }

    isBulkCementUSA(): boolean {
        return this.productLine.productLineId == this.PRODUCT_LINES.CementBulk
            && this.customerService.currentCustomer().countryCode.trim() == "US"
    }

    isMexico(): boolean {
        return this.customerService.currentCustomer().countryCode.trim() == "MX";
    }

    isSelected(product: any) {
        return this.productLine == product;
    }
}