import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductsApi } from '../../shared/services/api'
// import { SpecificationsStepListener } from '../order-builder/order-steps/specifications/specifications.step.component'

@Component({
    selector: 'search-product',
    templateUrl: './search-product.html',
    styleUrls: ['./search-product.scss']
})

export class SearchProductComponent /*implements somthing*/ {
    @Output() canceled = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();

    constructor(private api: ProductsApi) {
        this.api.advancedSearch('').subscribe((result) => {
            //console.log(result.json());
        });
    }
    
    confirm() {
        this.confirmed.emit();
    }

    cancel() {
        this.canceled.emit();
    }
}
