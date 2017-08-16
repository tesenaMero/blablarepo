import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { OrdersComponent } from './components/orders/orders.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'
import { NewOrderComponent } from './components/new-order/new-order.component'
import { CartComponent } from './components/cart/cart.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { BreadcrumbsComponent, BreadcrumbsItemComponent } from './shared/breadcrumbs'
import { ActionButtonComponent } from './shared/action-button/action-button.component';
import { OrderBuilderComponent } from './components/order-builder/order-builder.component'
import { StepperComponent, Step } from './shared/stepper';
import { 
    LocationStepComponent, 
    ProductSelectionStepComponent, 
    SpecificationsTableStepComponent, 
    TypeStepComponent 
}  from './components/order-builder/order-steps'

export const sharedConfig: NgModule = {
    bootstrap: [AppComponent],
    declarations: [
        // Hosts (page route parents)
        AppComponent,
        DashboardComponent,
        OrdersComponent,
        NewOrderComponent,
        CartComponent,

        // Regular components
        OrdersTableComponent,
        OrderBuilderComponent,
        LocationStepComponent,
        ProductSelectionStepComponent,
        SpecificationsTableStepComponent,
        TypeStepComponent,

        // Shared
        PaginationComponent,
        BreadcrumbsComponent,
        BreadcrumbsItemComponent,
        StepperComponent,
        Step,
        ActionButtonComponent
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
                    { path: 'new', component: NewOrderComponent },
                    { path: 'cart', component: CartComponent },
                ]
            },
            { path: '**', redirectTo: 'app' }
        ])
    ]
};
