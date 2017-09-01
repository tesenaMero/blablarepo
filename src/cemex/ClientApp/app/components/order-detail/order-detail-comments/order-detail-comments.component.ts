import { Component, Input } from '@angular/core';

import { OrdersApiService } from '../../../shared/services/orders-api.service';

@Component({
    selector: 'order-detail-comments',
    templateUrl: './order-detail-comments.component.html',
    styleUrls: ['./order-detail-comments.component.scss']
})
export class OrderDetailCommentsComponent {
    comments: any = [];
    isLoading: boolean = false;
    error: string | null = null;

    @Input() set orderItemId(orderItemId) {
        this.error = null;
        this.isLoading = true;

        this.OrdersApiService.getComments(orderItemId, 10, 1)
        .map(response => response.json())
        .subscribe(response => {
            this.comments.next(response.comments);
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.error = "Failed fetching comments";
        });
    }

    constructor(private OrdersApiService: OrdersApiService) {

    }
}
