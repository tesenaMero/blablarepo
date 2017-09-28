import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { OrderRequest } from '../../../shared/models/order-request';

@Component({
    selector: 'orders-table',
    templateUrl: './orders-table.html',
    styleUrls: ['./orders-table.scss', './orders-table.specific.scss']
})
export class OrdersTableComponent implements OnInit {
    @Input() orders: OrderRequest;
    @Input() isLoading: boolean;

    constructor(
        private t : TranslationService
    ) { }

    ngOnInit() {
    }

    changePage(page) {
    }

}
