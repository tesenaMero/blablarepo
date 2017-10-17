import * as _ from 'lodash';

import { OrderRequest as OrderRequestType } from '../types';

export const buisnessLIneCodes = {
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

    isBlocked() {
        return this.orderRequest.statusCode === 'BLCK';
    }

    isHolded() {
        return this.orderRequest.statusCode === 'HOLD';
    }

    isProcessed() {
        return this.orderRequest.statusCode === 'INPC';
    }

    isCompleted() {
        return this.orderRequest.statusCode === 'CMPO';
    }

    isReadyMix() {
        return isReadyMix(this.orderRequest);
    }

    isCement() {
        return isCement(this.orderRequest);
    }

    isAggregates() {
        return isAggregates(this.orderRequest);
    }

    setFavorite(favorite) {
        this.orderRequest.isFavorite = favorite;
    }
}

export const isReadyMix = order => _.get(order, 'salesArea.businessLine.businessLineCode') === buisnessLIneCodes.rmx;
export const isCement = order => _.get(order, 'salesArea.businessLine.businessLineCode') === buisnessLIneCodes.cem;
export const isAggregates = order => _.get(order, 'salesArea.businessLine.businessLineCode') === buisnessLIneCodes.aggr;
export const getOrderType = order => _.get(order, 'salesArea.businessLine.businessLineCode');
