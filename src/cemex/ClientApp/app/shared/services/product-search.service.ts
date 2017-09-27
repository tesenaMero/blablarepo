import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProductColorApi } from './api/product-colors.service';

@Injectable()
export class SearchProductService {
    searchedProduct = new BehaviorSubject<any>(undefined);
    productColors = new BehaviorSubject<any>(undefined);

    constructor(private productColorApi: ProductColorApi) {
    }

    selectProduct(product: any) {
        this.searchedProduct.next(product);
    }

    fetchProductColors(productLineId: number) {
        this.productColorApi.productColors(productLineId).subscribe((response) => this.productColors.next(response.json().productColors));
    }
}
