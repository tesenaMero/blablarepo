import { Component, Input } from '@angular/core';

import { OrdersApi } from '../../../shared/services/api';

@Component({
    selector: 'order-detail-logs',
    templateUrl: './order-detail-logs.component.html',
    styleUrls: ['./order-detail-logs.component.scss']
})
export class OrderDetailLogsComponent {
    logs: any = [];
    isLoading: boolean = false;
    error: string | null = null;

    @Input() set orderItemId(orderItemId) {
        this.error = null;
        this.isLoading = true;

        this.OrdersApi.fetchLogs(orderItemId, 100, 1)
        .map(response => response.json())
        .subscribe(response => {
            this.logs.next(response.logs);
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.error = "Failed fetching logs";
        });
    }

    constructor(private OrdersApi: OrdersApi) {
        
    }
}
