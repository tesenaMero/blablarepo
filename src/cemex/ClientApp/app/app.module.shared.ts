import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { OrdersComponent } from './components/orders/orders.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'
import { NewOrderComponent } from './components/new-order/new-order.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'
import { CartComponent } from './components/cart/cart.component';
import { NewProjectProfile } from './components/new-project-profile/new-project-profile.component'
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { BreadcrumbsComponent, BreadcrumbsItemComponent } from './shared/components/breadcrumbs'
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { OrderBuilderComponent } from './components/order-builder/order-builder.component'
import { StepperComponent, Step } from './shared/components/stepper';
import { 
    LocationStepComponent, 
    ProductSelectionStepComponent, 
    SpecificationsTableStepComponent, 
    ModeStepComponent 
}  from './components/order-builder/order-steps'

// Services
import { WindowRef } from './shared/services/window-ref.service';
import { ApiService } from './shared/services/api.service';
import { OrdersApiService } from './shared/services/orders-api.service';
import { OrdersService } from './shared/services/orders.service';

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
        OrderDetailComponent,

        // Regular components
        OrdersTableComponent,
        OrderBuilderComponent,
        LocationStepComponent,
        ProductSelectionStepComponent,
        SpecificationsTableStepComponent,
        ModeStepComponent,

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
                    { path: 'new-project', component: NewProjectProfile },
                    { path: 'order-detail', component: OrderDetailComponent },
		        ]
            },
            { path: '**', redirectTo: 'app' }
        ])
    ],
    providers: [
        WindowRef,
        ApiService,
        OrdersApiService,
        OrdersService
    ]
};
