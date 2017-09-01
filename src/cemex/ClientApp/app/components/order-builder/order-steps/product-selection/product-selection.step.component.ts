import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductLineApi } from '../../../../shared/api'
import { CreateOrderService } from '../../../../shared/services/create-order.service';

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.html',
    styleUrls: ['./product-selection.scss'],
    host: {'class': 'w-100' }
})
export class ProductSelectionStepComponent {
    @Output() onCompleted = new EventEmitter<any>();

    productLines = [];
    productLine: any;

    constructor(private api: ProductLineApi, private orderManager: CreateOrderService) {
        this.api.all().subscribe((response) => {
            this.productLines = response.json().productLines;
        });
    }

    select(product: any) {
        this.productLine = product;
        this.orderManager.selectProductLine(product);
        this.onCompleted.emit();
    }

    isSelected(product: any) {
        return this.productLine == product;
    }
}
