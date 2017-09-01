import { Component, Input } from '@angular/core';

import { OrdersApi } from '../../../shared/services/api';

@Component({
    selector: 'order-detail-comments',
    templateUrl: './order-detail-comments.component.html',
    styleUrls: ['./order-detail-comments.component.scss']
})
export class OrderDetailCommentsComponent {
    comments: any = [];
    isLoading: boolean = false;
    error: string | null = null;
    newMessage: string = '';
    isSending: boolean = false;

    @Input() set orderItemId(orderItemId) {
        this.error = null;
        this.isLoading = true;

        this.OrdersApi.getComments(orderItemId, 10, 1)
        .map(response => response.json())
        .subscribe(response => {
            this.comments.next(response.comments);
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.error = "Failed fetching comments";
        });
    }

    constructor(private OrdersApi: OrdersApi) {

    }

    onSubmit() {
        if (this.newMessage) {
            this.isSending = true;
            this.OrdersApi.sendComment(this.orderItemId, this.newMessage)
            .map(response => response.json())
            .subscribe(response => {
                // SUCCESS NOTIFY
                this.isSending = false;
            }, err => {
                // ERROR NOTIFY
                this.isSending = false;
            });
        }
    }
}
