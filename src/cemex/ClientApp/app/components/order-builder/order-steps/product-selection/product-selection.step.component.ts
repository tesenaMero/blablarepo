import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ProductLineApi } from '../../../../shared/services/api'
import { CreateOrderService } from '../../../../shared/services/create-order.service';

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.step.html',
    styleUrls: ['./product-selection.step.scss'],
    host: { 'class': 'w-100' }
})
export class ProductSelectionStepComponent {
    @Output() onCompleted = new EventEmitter<any>();

    productLines = [];
    productLine: any;

    constructor(private api: ProductLineApi, private orderManager: CreateOrderService) {
        this.api.all().subscribe((response) => {
            let productLines = response.json().productLines;
            console.log(productLines);

            let bagCement = this.getBagCement(productLines);
            let multiproduct = this.getMultiproduct(productLines)

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

            this.productLines = productLines;
        });
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
        this.onCompleted.emit(product);
    }

    isSelected(product: any) {
        return this.productLine == product;
    }
}