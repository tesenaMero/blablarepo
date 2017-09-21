import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SearchProductService {
    searchedProduct = new BehaviorSubject<any>(undefined);

    constructor() {
    }

    selectProduct(product: any) {
        this.searchedProduct.next(product);
    }
}
