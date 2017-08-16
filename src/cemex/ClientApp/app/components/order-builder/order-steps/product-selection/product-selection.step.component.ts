import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.html',
    styleUrls: ['./product-selection.scss'],
    host: {'class': 'w-100' }
})
export class ProductSelectionStepComponent {
    @Output() onCompleted = new EventEmitter<any>();

    products = [
        "ReadyMix",
        "Cement Bulk",
        "Cement Package",
        "Aggregates",
        "Multiproducts"
    ]

    product = "";

    constructor() { }

    select(product: any) {
        this.product = product;
        this.onCompleted.emit(product);
    }

    isSelected(product: any) {
        return this.product == product;
    }
}
