import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { OrdersComponent } from './components/orders/orders.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'
import { NewOrderComponent } from './components/new-order/new-order.component'
import { CartComponent } from './components/cart/cart.component';
import { NewOrderComponentSt1 } from './components/new-order/neworderst1.component'
import { NewProjectProfile } from './components/new-project-profile/new-project-profile.component'
import { PaginationComponent } from './shared/pagination/pagination.component';
import { SpecificationsTableComponent } from './components/specifications-table/specifications-table.component'
import { ProductSelectionComponent } from './components/product-selection/product-selection.component'

//exports
export const sharedConfig: NgModule = {
    bootstrap: [AppComponent],
    declarations: [
        // Hosts (page route parents)
        AppComponent,
        DashboardComponent,
        OrdersComponent,
        NewOrderComponent,
        CartComponent,
        NewProjectProfile,

        // Regular components
        OrdersTableComponent,
        SpecificationsTableComponent,
        ProductSelectionComponent,
        NewOrderComponentSt1,

        // Shared
        PaginationComponent
    ],
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'app', pathMatch: 'full' },
            { path: 'orders', redirectTo: 'app', pathMatch: 'full' },
            {
                path: 'app', component: DashboardComponent,
                children: [
                    { path: '', redirectTo: 'orders', pathMatch: 'full' },
                    { path: 'orders', component: OrdersComponent },
                    { path: 'newst1', component: NewOrderComponentSt1 },		    
                    { path: 'new', component: NewOrderComponent },
                    { path: 'cart', component: CartComponent },
                    { path: 'newproj', component: NewProjectProfile },
		        ]
            },
            { path: '**', redirectTo: 'app' }
        ])
    ]
};
