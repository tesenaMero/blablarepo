import * as _ from 'lodash';

import { OrderRequest as OrderRequestType } from '../types';

const buisnessLIneCodes = {
    rmx: 'RMX',
    cem: 'CEM',
    aggr: 'AGR'
}

export class OrderRequest {
    orderRequest: OrderRequestType;

    constructor(orderRequest: OrderRequestType) {
        this.orderRequest = orderRequest;
    }
    
    isCanceled() {
        return this.orderRequest.statusCode === 'CNCL';
    }

    isPending() {
        return this.orderRequest.statusCode === 'PEND';
    }

    isDraft() {
        return this.orderRequest.statusCode === 'DRFT';
    }

    isConfirmed() {
        return this.orderRequest.statusCode === 'CONF';
    }

    isReadyMix() {
        return this.orderRequest.businessLine === buisnessLIneCodes.rmx;
    }

    isCement() {
        return this.orderRequest.businessLine === buisnessLIneCodes.cem;
    }

    isAggregates() {
        return this.orderRequest.businessLine === buisnessLIneCodes.aggr;
    }

    setFavorite(favorite) {
        this.orderRequest.isFavorite = favorite;
    }
}