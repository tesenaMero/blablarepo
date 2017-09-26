import { Injectable } from '@angular/core';
import { CreateOrderService } from '../shared/services/create-order.service'
import { CustomerService } from '../shared/services/customer.service'
import { DeliveryMode } from '../models/delivery.model';

@Injectable()
export class Validations {
    private MODE = DeliveryMode;
    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    constructor(private manager: any, private customer: any) {}

    isMexicoCustomer() {
        return this.customer.currentCustomer().countryCode.trim() == "MX"
    }

    isUSACustomer() {
        return this.customer.currentCustomer().countryCode.trim() == "USA"
    }

    isReadyMix() {
        return this.manager.productLine.productLineId == this.PRODUCT_LINES.Readymix
    }

    isCement() {
        return this.manager.productLine.productLineId != this.PRODUCT_LINES.Readymix
    }

    isBulkCement() {
        return this.manager.productLine.productLineId == this.PRODUCT_LINES.CementBulk
    }

    isPickup() {
        return this.manager.shippingCondition.shippingConditionId == this.MODE.Pickup
    }

    isDelivery() {
        return this.manager.shippingCondition.shippingConditionId == this.MODE.Delivery
    }

    shouldHidePayment() {
        return this.customer.currentCustomer().countryCode.trim() == "US" || this.manager.productLine.productId == this.PRODUCT_LINES.Readymix;
    }
}