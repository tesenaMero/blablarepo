import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { OrdersComponent } from './components/orders/orders.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'

export const sharedConfig: NgModule = {
    bootstrap: [ AppComponent ],
    declarations: [
        // Hosts (page route parents)
        AppComponent,
        OrdersComponent,

        // Regular components
        OrdersTableComponent
    ],
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: OrdersComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
};
