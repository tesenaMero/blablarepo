import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

// Cemex components
import { CmxButtonModule } from '@cemex/cmx-button-v1/dist';

// Components
import { AppComponent } from './components/app/app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { OrdersComponent } from './components/orders/orders.component'
import { DraftsComponent } from './components/drafts/drafts.component'
import { ProjectProfilesComponent } from './components/project-profiles/project-profiles.component'
import { ProjectProfileCreatorComponent } from './components/project-profile-creator/project-profile-creator.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'
import { LoadingTableComponent } from './components/orders-table/loading-table/loading-table.component'
import { NewOrderComponent } from './components/new-order/new-order.component'
import { NewProjectProfile } from './components/new-project-profile/new-project-profile.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'
import { CartComponent } from './components/cart/cart.component';
import { OrderBuilderComponent } from './components/order-builder/order-builder.component'
import { 
    LocationStepComponent, 
    ProductSelectionStepComponent, 
    SpecificationsTableStepComponent, 
    ModeStepComponent,
    SummaryStepComponent
}  from './components/order-builder/order-steps'

// Pipes
import { NoSpacePipe, ZeroPadPipe } from './pipes/index'

// Shared components
import { StepperComponent, Step } from './shared/components/stepper';
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { BreadcrumbsComponent, BreadcrumbsItemComponent } from './shared/components/breadcrumbs'
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { DLSTableComponent } from './shared/components/table/table.component';

// Services
import { WindowRef } from './shared/services/window-ref.service';
import { ApiService } from './shared/services/api.service';
import { OrdersApiService } from './shared/services/orders-api.service';
import { OrdersService } from './shared/services/orders.service';
import { CreateOrderService } from './shared/services/create-order.service';
import { LoginApiService } from './shared/services/login-api.service';
import { ProjectProfileApiService } from './shared/services/project-profile-api.service';
import { ContractsApiService } from './shared/services/contracts-api.service';
import { JobsiteApiService } from './shared/services/jobsites-api.service';

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
        NewProjectProfile,
        OrderDetailComponent,

        // Pipes
        ZeroPadPipe,
        NoSpacePipe,

        // Regular components
        OrdersTableComponent,
        LoadingTableComponent,
        OrderBuilderComponent,
        LocationStepComponent,
        ProductSelectionStepComponent,
        SpecificationsTableStepComponent,
        ModeStepComponent,
        SummaryStepComponent,
        ProjectProfileCreatorComponent,

        // Shared
        PaginationComponent,
        BreadcrumbsComponent,
        BreadcrumbsItemComponent,
        StepperComponent,
        Step,
        ActionButtonComponent,
        DLSTableComponent
    ],
    imports: [
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
                    { path: 'new-project', component: NewProjectProfile },
                    { path: 'order-detail', component: OrderDetailComponent },
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
        OrdersService,
        CreateOrderService,
        LoginApiService,
        ProjectProfileApiService,
        ContractsApiService,
        JobsiteApiService
    ]
};
