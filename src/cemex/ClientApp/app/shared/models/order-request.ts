import * as _ from 'lodash';

import { OrderRequest as OrderRequestType } from '../types';

export class OrderRequest {
    orderRequest: OrderRequestType;
    buisnessLIneCodes = {
        rmx: 'RMX',
        cem: 'CEM',
        aggr: 'AGR'
    }

    constructor(orderRequest: OrderRequestType) {
        this.orderRequest = orderRequest;
    }
    
    isCanceled() {
        return this.orderRequest.statusCode === 'CNCL';
    }

    isReadyMix() {
        return this.orderRequest.businessLine === this.buisnessLIneCodes.rmx;
    }

    isCement() {
        return this.orderRequest.businessLine === this.buisnessLIneCodes.cem;
    }

    isAggregates() {
        return this.orderRequest.businessLine === this.buisnessLIneCodes.aggr;
    }

    setFavorite(favorite) {
        this.orderRequest.isFavorite = favorite;
    }
}