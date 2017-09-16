import { Component, OnInit, PipeTransform, Pipe, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ETypeProduct, CementPackageSpecification, CartProductGroup, ReadymixSpecification } from '../../models/index';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { WindowRef } from '../../shared/services/window-ref.service';
import { DOCUMENT } from '@angular/platform-browser';
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';
import localForage = require('localforage');

@Component({
    selector: 'cart-page',
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
    _productGroups: CartProductGroup[] = [];
    _productsReadymix: ReadymixSpecification[] = [];
    _products: any[] = [];
    disableCartBtn: boolean;

    private order: any;
    private loadings = {
        order: true
    }

    constructor(private drafts: DraftsService, private dashboard: DashboardService, private jsonObjService: EncodeDecodeJsonObjService, private location: Location, private windowRef: WindowRef, @Inject(DOCUMENT) private document: any) { }

    ngOnInit() {
        this.loadings.order = true;
        this.drafts.prices(68).subscribe((response) => {
            this.order = response.json();
            this.mockStuff();
            this.loadings.order = false;
        });
    }

    makeOrder() {
        this.dashboard.alertInfo("Placing order...");
        this.drafts.createOrder(68).subscribe((response) => {
            this.dashboard.alertSuccess("Order placed successfully!");
        });
    }

    back() {
        this.location.back();
    }

    mockStuff() {
        this.disableCartBtn = false;
        let dummyProductGpo: CartProductGroup[] = [
            {
                id: 1,
                products: [
                    {
                        contract: "10-201702189034 Remaining volume: 180",
                        deliveryMode: "Delivery",
                        location: "Southwest 68th Street building",
                        maximumCapacity: 10,
                        payment: "Credit",
                        productDescription: "Cement",
                        productId: "20939302/10292/10102",
                        quantity: 10,
                        requestDate: "13/07/2017",
                        requestTime: "15:00 - 16:00",
                        unit: "tons",
                        unitaryPrice: 2000,
                        pointDelivery: "Backstreet yard"
                    },
                    {
                        contract: "10-201702189034 Remaining volume: 180",
                        deliveryMode: "Delivery",
                        location: "Southwest 68th Street building",
                        maximumCapacity: 10,
                        payment: "Credit",
                        productDescription: "Cement",
                        productId: "20939302/10292/10102",
                        quantity: 2,
                        requestDate: "13/07/2017",
                        requestTime: "15:00 - 16:00",
                        unit: "tons",
                        unitaryPrice: 2500,
                        pointDelivery: "Backstreet yard"
                    }
                ]
            },
            {
                id: 2,
                products: [
                    {
                        contract: "10-201702189034 Remaining volume: 180",
                        deliveryMode: "Delivery",
                        location: "Southwest 68th Street building",
                        maximumCapacity: 10,
                        payment: "Credit",
                        productDescription: "Cement",
                        productId: "20939302/10292/10102",
                        quantity: 10,
                        requestDate: "13/07/2017",
                        requestTime: "15:00 - 16:00",
                        unit: "tons",
                        unitaryPrice: 2500,
                        pointDelivery: "Backstreet yard"
                    }
                ]
            }
        ];

        let dummyProducts: ReadymixSpecification[] = [
            {
                productDescription: this.order.items[0].product.productDesc,
                quantity: 1,
                unit: "tons",
                requestDate: "13/07/2017",
                requestTime: "15.00 - 16.00",
                location: this.order.items[0].shippingSource.address.cityDesc + ", " + this.order.items[0].shippingSource.address.regionDesc + ", " + this.order.items[0].shippingSource.address.streetName,
                productId: this.order.items[0].product.productCode,
                contract: "10-201702189034    Remaining volume: 180",
                pointDelivery: this.order.pointOfDelivery.pointOfDeliveryDesc,
                projectProfile: {
                    id: 1,
                    aplication: "Roof",
                    name: "My Project Profile with quite long technical title, that it must be for more rows",
                    loadSize: "10 tons",
                    slump: "",
                    spacing: "10 min"
                },

                dischargeTime: "60 min",
                transportMethod: "Truck",
                unloadType: "Pump",
                pumpCapacityMax: "40 m3/s",
                pumpCapacityMin: "30 m3/s",
                loadSize: "10 tons",
                spacing: "10 mins",
                deliveryMode: "Delivery",
                kicker: true,
                unitaryPrice: this.order.items[0].totalPrice
            }
        ];

        this._productsReadymix = dummyProducts;
        this._products = this._productGroups.length ? this._productGroups : this._productsReadymix;
    }

    placeOrder() {
        console.log(sessionStorage.getItem('access_token'))
        const mock = {
            sourceApp: "order-taking",
            date: new Date().toISOString(),
            screenToShow: "cash-sales",
            credentials : {
                token : sessionStorage.getItem('access_token'),
                jwt : sessionStorage.getItem('jwt')
            },
            data: [{
                orderId: this.drafts._draftId,
                companyCode: "7180",
                customerCode: "0050163248",
                jobSiteCode: "0065014102",
                payerCode: "0065014102",
                orderAmount: 12.00,
                documents: [
                ]
            }]
        }
        this.disableCartBtn = true;
        let encoded = this.jsonObjService.encodeJson(mock);
        this.document.location.href = 'https://invoices-payments-dev2.mybluemix.net/invoices-payments/open/' + encoded;
    }
}