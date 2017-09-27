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
        CementBulk: 1
    }

    static manager: any;
    static customer: any;

    constructor() {}

    static init(manager: any, customer: any) {
        Validations.manager = manager;
        Validations.customer = customer;
    }

    static isMexicoCustomer() {
        return this.customer.currentCustomer().countryCode.trim() === "MX"
    }

    static isUSACustomer() {
        return this.customer.currentCustomer().countryCode.trim() === "US"
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

    static isPickup() {
        return _.get(this.manager, 'shippingCondition.shippingConditionId') === this.MODE.Pickup
    }

    static isDelivery() {
        return _.get(this.manager, 'shippingCondition.shippingConditionId') === this.MODE.Delivery
    }

    static shouldHidePayment() {
        return this.customer.currentCustomer().countryCode.trim() === "US" 
                || _.get(this.manager, 'productLine.productId') === this.PRODUCT_LINES.Readymix;
    }

    static shouldHidePOD(): boolean {
        if (Validations.isUSACustomer()) { return true; }
        else if (Validations.isPickup()) { return true; }
        else { return false; }
    }
}