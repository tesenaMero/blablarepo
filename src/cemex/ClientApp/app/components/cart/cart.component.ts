import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ETypeProduct, CementPackageSpecification } from '../../models/index';

interface CartProductGroup {
    id: number;
    products: CementPackageSpecification[];
}

@Component({
    selector: 'cart-page',
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

    _productGroups: CartProductGroup[];
    constructor(private location: Location) { }

    ngOnInit() {
        this._productGroups = [
            {
                id: 1,
                products: [
                    {
                        contract: "",
                        deliveryMode: "",
                        maximumCapacity: 0,
                        payment: "",
                        productDescription: "",
                        productId: "",
                        quantity: 0,
                        requestDate: "",
                        requestTime: "",
                        unit: ""
                    }
                ]
            }
        ]
    }

    back() {
        this.location.back();
    }
}