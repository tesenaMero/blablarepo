import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoreApi } from '../../../../shared/api/core.api'

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.html',
    styleUrls: ['./product-selection.scss'],
    host: {'class': 'w-100' }
})
export class ProductSelectionStepComponent {
    @Output() onCompleted = new EventEmitter<any>();

    products = [];
    product: any;

    constructor(private api: CoreApi) {
        this.api.productsLines().subscribe((response) => {
            this.products = response.json().productLines;
            console.log(this.products);
        });
    }

    select(product: any) {
        this.product = product;
        this.onCompleted.emit(product);
    }

    isSelected(product: any) {
        return this.product == product;
    }
}
