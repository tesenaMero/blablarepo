import { Injectable } from '@angular/core';
import { CreateOrderService } from '../shared/services/create-order.service'
import { CustomerService } from '../shared/services/customer.service'
import { DeliveryMode } from '../models/delivery.model';
import * as _ from 'lodash';

@Injectable()
export class Validations {
    static MODE = DeliveryMode;
    static PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1,
        CementBag: 2,
        MultiProduct: 3
    }

    static manager: any;
    static customer: any;

    constructor() {}

    static init(manager: CreateOrderService, customer: CustomerService) {
        Validations.manager = manager;
        Validations.customer = customer;
    }

    static isMexicoCustomer() {
        return this.customer.currentCustomer() && this.customer.currentCustomer().countryCode && this.customer.currentCustomer().countryCode.trim() === "MX" || undefined
    }

    static isUSACustomer() {
        return this.customer.currentCustomer() && this.customer.currentCustomer().countryCode && this.customer.currentCustomer().countryCode.trim() === "US" || undefined
    }

    static isReadyMix() {
        return _.get(this.manager, 'productLine.productLineId') === this.PRODUCT_LINES.Readymix
    }

    static isCement() {
        return _.get(this.manager, 'productLine.productLineId') !== this.PRODUCT_LINES.Readymix
    }

    static isBulkCement() {
        return _.get(this.manager, 'productLine.productLineId') === this.PRODUCT_LINES.CementBulk
    }

    static isCementBag() {
        return _.get(this.manager, 'productLine.productLineId') === this.PRODUCT_LINES.CementBag
    }

    static isProductCementBag(product) {
        return product.product.product.productLine.productLineId === this.PRODUCT_LINES.CementBag
    }
    static isProductCementBulk(product) {
        return product.product.product.productLine.productLineId === this.PRODUCT_LINES.CementBulk
    }
    static isProductReadyMix(product) {
        return product.product.product.productLine.productLineId === this.PRODUCT_LINES.Readymix
    }
    static isProductMultiproduct(product) {
        return product.product.product.productLine.productLineId === this.PRODUCT_LINES.MultiProduct
    }

    // TODO: Replace Id with code in enum
    static isPickup() {
        return _.get(this.manager, 'shippingCondition.shippingConditionCode') === this.MODE.Pickup;
    }

    // TODO: Replace Id with code in enum
    static isDelivery() {
        return _.get(this.manager, 'shippingCondition.shippingConditionCode') === this.MODE.Delivery;
    }

    static shouldHidePayment() {
        return Validations.isUSACustomer() || Validations.isReadyMix();
    }

    static shouldHidePOD(): boolean {
        if (Validations.isUSACustomer()) { return true; }
        else if (Validations.isPickup()) { return true; }
        else { return false; }
    }
}