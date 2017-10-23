import { Component, Input } from '@angular/core';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

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
        .first()
        .subscribe(response => {
            if (!response || !response.ok || !response.logItems) {
                this.isLoading = false;
                this.error = "Failed fetching logs";
                return;
            }

            this.logs = response.logItems && response.logItems.filter(log => 
                { 
                    // Hide draft actions
                    const isDraft = log.newPayload && 
                        JSON.parse(log.newPayload).status && 
                            JSON.parse(log.newPayload).status.statusCode === 'DRFT';
                    return !isDraft;
                });
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.error = "Failed fetching logs";
        });
    }

    constructor(private OrdersApi: OrdersApi, private t: TranslationService) {
        
    }
}
