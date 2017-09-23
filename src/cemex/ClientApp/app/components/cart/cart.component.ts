import { Component, OnInit, PipeTransform, Pipe, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ETypeProduct, CementPackageSpecification, CartProductGroup, ReadymixSpecification } from '../../models/index';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { WindowRef } from '../../shared/services/window-ref.service';
import { TranslationService } from '../../shared/services/translation.service';
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
    private _draftId: any;

    private order: any; 
    private draftOrder: any;
    private loadings = {
        order: true
    }

    constructor(
        private t: TranslationService,
        private drafts: DraftsService,
        private dashboard: DashboardService,
        private jsonObjService: EncodeDecodeJsonObjService,
        private location: Location,
        private windowRef: WindowRef,
        @Inject(DOCUMENT) private document: any,
        private orderManager: CreateOrderService
    ) {
        this._draftId = sessionStorage.getItem('draftId');
        console.log(this.orderManager.shippingCondition);
    }

    ngOnInit() {
        this.loadings.order = true;
        this.drafts.optimalSourcesPatch(this._draftId).flatMap((x) => {
            return this.drafts.prices(this._draftId);
        }).subscribe((response) => {
            this.draftOrder = response.json();
            this.loadings.order = false;
        }, (error) => {
            this.loadings.order = false;
            this.dashboard.alertError("Something wrong happened");
            throw new Error('prices Error -> ' + JSON.stringify(error));
        });
    }

    getSubtotal() {
        let summ = 0;
        this.draftOrder.items.forEach(item => {
            summ += item.grossPrice * item.quantity;
        });
        return summ;
    }

    getTaxes() {
        let taxes = 0;
        this.draftOrder.items.forEach(item => {
            taxes += item.taxAmount * item.quantity;
        });
        return taxes;
    }

    getGrandTotal() {
        let total = 0;
        this.draftOrder.items.forEach(item => {
            total += item.totalPrice;
        });
        return total;
    }

    makeOrder() {
        this.dashboard.alertInfo("Placing order...");
        this.drafts.createOrder(this._draftId, '').subscribe((response) => {
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
        if (!Boolean(this._draftId)) {
            alert('no draft order ID');
            return;
        }
        const customer = JSON.parse(sessionStorage.getItem('currentCustomer'));
        let data = [];
        this.draftOrder.items.forEach(item => {
            data.push(
                {
                    orderID: this.draftOrder.orderId,
                    companyCode: this.draftOrder.salesArea.salesOrganizationCode,
                    customerCode: customer.legalEntityTypeCode,
                    jobSiteCode: this.draftOrder.jobsite.jobsiteCode,
                    payerCode: customer.legalEntityTypeCode,
                    orderAmount: item.totalPrice,
                    documents: [
                    ]
                }
            )
        })
        const cartItems = {
            sourceApp: "order-taking",
            date: new Date().toISOString(),
            screenToShow: "cash-sales",
            credentials: {
                token: sessionStorage.getItem('access_token'),
                jwt: sessionStorage.getItem('jwt')
            },
            data: data
        }
        this.disableCartBtn = true;
        let encoded = this.jsonObjService.encodeJson(cartItems);
        sessionStorage.removeItem('draftId');
        this.document.location.href = 'https://invoices-payments-dev2.mybluemix.net/invoices-payments/open/' + encoded;
    }
}