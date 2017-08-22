import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// Cemex components
import { CmxButtonModule } from '@cemex/cmx-button-v1/dist';

// Components
import { AppComponent } from './components/app/app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { OrdersComponent } from './components/orders/orders.component'
import { DraftsComponent } from './components/drafts/drafts.component'
import { ProjectProfilesComponent } from './components/project-profiles/project-profiles.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'
import { NewOrderComponent } from './components/new-order/new-order.component'
import { CartComponent } from './components/cart/cart.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { BreadcrumbsComponent, BreadcrumbsItemComponent } from './shared/components/breadcrumbs'
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { OrderBuilderComponent } from './components/order-builder/order-builder.component'
import { StepperComponent, Step } from './shared/components/stepper';
import { 
    LocationStepComponent, 
    ProductSelectionStepComponent, 
    SpecificationsTableStepComponent, 
    ModeStepComponent,
    SummaryStepComponent
}  from './components/order-builder/order-steps'

// Pipes
import { NoSpacePipe, ZeroPadPipe } from './pipes/index'

// Services
import { WindowRef } from './shared/services/window-ref.service';
import { ApiService } from './shared/services/api.service';
import { OrdersApiService } from './shared/services/orders-api.service';
import { OrdersService } from './shared/services/orders.service';

export const sharedConfig: NgModule = {
    bootstrap: [AppComponent],
    declarations: [
        // Hosts (page route parents)
        AppComponent,
        ProjectProfilesComponent,
        DraftsComponent,
        DashboardComponent,
        OrdersComponent,
        NewOrderComponent,
        CartComponent,

        // Pipes
        ZeroPadPipe,
        NoSpacePipe,

        // Regular components
        OrdersTableComponent,
        OrderBuilderComponent,
        LocationStepComponent,
        ProductSelectionStepComponent,
        SpecificationsTableStepComponent,
        ModeStepComponent,
        SummaryStepComponent,

        // Shared
        PaginationComponent,
        BreadcrumbsComponent,
        BreadcrumbsItemComponent,
        StepperComponent,
        Step,
        ActionButtonComponent
    ],
    imports: [
        FlexLayoutModule,
        CmxButtonModule,
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
                    { path: 'project-profiles', component: ProjectProfilesComponent },
                    { path: 'drafts', component: DraftsComponent },
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
