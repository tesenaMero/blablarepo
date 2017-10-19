import { Component, Input } from '@angular/core';

import { OrdersApi } from '../../../shared/services/api';

@Component({
    selector: 'order-detail-comments',
    templateUrl: './order-detail-comments.component.html',
    styleUrls: ['./order-detail-comments.component.scss']
})

// TODO Support pagination
export class OrderDetailCommentsComponent {
    comments: any = [];
    isLoading: boolean = false;
    error: string | null = null;
    newMessage: string = '';
    isSending: boolean = false;
    postBtn: string = 'Post a comment';
    private id: number;

    @Input() set orderItemId(orderItemId) {
        this.error = null;
        this.id = orderItemId;
        this.getComments(orderItemId);
    }

    constructor(private OrdersApi: OrdersApi) {}

    getComments(id) {
        this.isLoading = true;
        this.OrdersApi.getComments(id, 100, 1)
        .map(response => response.json())
        .subscribe(response => {
            const comments = response ? 
                response.comments.sort((a, b) => 
                    new Date(a.createdDateTime).getTime() - new Date(b.createdDateTime).getTime()) : [];
            this.comments = comments;
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.error = "Failed fetching comments";
        });
    }

    onSubmit() {
        if (this.newMessage) {
            this.isSending = true;
            this.postBtn = 'Posting';
            this.OrdersApi.sendComment(this.id, this.newMessage)
            .map(response => response.json())
            .subscribe(response => {
                // SUCCESS NOTIFY
                this.newMessage = '';
                this.isSending = false;
                this.postBtn = 'Post a comment';
                this.getComments(this.id);
            }, err => {
                // ERROR NOTIFY
                this.postBtn = 'Post a comment';
                this.isSending = false;
            });
        }
    }
}
