import * as _ from 'lodash';

import { OrderRequest as OrderRequestType } from '../types';

export class OrderRequest {
    order: OrderRequestType;

    constructor(order: OrderRequestType) {
        this.order = order;
    }
    
    isCanceled() {
        return _.get(this.order, 'orderRequestStatus.statusId') === 'CNCL';
    }

    isReadyMix() {
        return !!this.order.orderRequestItems.find((item) => 
            item.productType.productTypeCode === '0006');
    }
}