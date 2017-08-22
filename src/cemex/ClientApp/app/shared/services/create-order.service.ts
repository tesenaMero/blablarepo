import { Injectable } from '@angular/core';

import * as types from '../../shared/types/CreateOrder';

/**
 * Create an order for API V2
 */

@Injectable()
export class CreateOrder {
        public orderId;
        public orderCode;
        public orderName;
        public createdDateTime;
        public updatedDateTime;
        public programmedDateTime;
        public requestedDateTime;
        public draftDateTime;
        public purchaseOrder;
        public status: types.Status;
        public salesArea: types.SalesArea;
        public orderType: types.OrderType;
        public customer: types.Customer;
        public shippingCondition: types.ShippingCondition;

    constructor(
        orderId,
        orderCode,
        orderName,
        createdDateTime,
        updatedDateTime,
        programmedDateTime,
        requestedDateTime,
        draftDateTime,
        purchaseOrder,
        status: types.Status,
        salesArea: types.SalesArea,
        orderType: types.OrderType,
        customer: types.Customer,
        shippingCondition: types.ShippingCondition,
    ) {
        this.orderId = orderId;
        this.orderCode = orderCode;
        this.orderName = orderName;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
        this.programmedDateTime = programmedDateTime;
        this.requestedDateTime = requestedDateTime;
        this.draftDateTime = draftDateTime;
        this.purchaseOrder = purchaseOrder;
        this.status = status;
        this.salesArea = salesArea;
        this.orderType= orderType;
        this.customer = customer;
        this.shippingCondition = shippingCondition;

    }

    // ETC

    // selectDeliveryType() {

    // }

    // selectJobsite() {

    // }

    // selectContact() {

    // }

    // setSpecialInstructions() {

    // }

    // addProduct() {

    // }

    // removeProduct() {

    // }
}
