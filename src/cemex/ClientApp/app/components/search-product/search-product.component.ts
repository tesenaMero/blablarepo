import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductsApi } from '../../shared/services/api'

@Component({
    selector: 'search-product',
    templateUrl: './search-product.html',
    styleUrls: ['./search-product.scss']
})

export class SearchProductComponent {
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
