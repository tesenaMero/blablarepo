import * as _ from 'lodash';

import { OrderRequest as OrderRequestType } from '../types';

export class OrderRequest {
    orderRequest: OrderRequestType;

    constructor(orderRequest: OrderRequestType) {
        this.orderRequest = orderRequest;
    }
    
    isCanceled() {
        return _.get(this.orderRequest, 'orderRequestStatus.statusId') === 'CNCL';
    }

    isReadyMix() {
        return !!this.orderRequest.orderRequestItems.find((item) => 
            item.productType.productTypeCode === '0006');
    }

    isCement() {
        const cementCodes = ['0002', '0001'];
        return !!this.orderRequest.orderRequestItems.find((item) => 
            !!cementCodes.find((code) => item.productType.productTypeCode === code));
    }

    isAggregates() {
        return !!this.orderRequest.orderRequestItems.find((item) => 
            item.productType.productTypeCode === '0006');
    }
}