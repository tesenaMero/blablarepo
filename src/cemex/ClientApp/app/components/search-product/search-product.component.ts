import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'search-product',
    templateUrl: './search-product.html',
    styleUrls: ['./search-product.scss']
})

export class SearchProductComponent {
    @Output() canceled = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();

    constructor() {
    }

    confirm() {
        this.confirmed.emit();
    }

    cancel() {
        this.canceled.emit();
    }
}
