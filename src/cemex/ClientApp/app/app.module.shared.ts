import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

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
import { SummaryStepComponent } from './components/order-builder/order-steps/summary/summary.step.component';
import { 
    LocationStepComponent, 
    ProductSelectionStepComponent, 
    SpecificationsStepComponent, 
    ModeStepComponent,
}  from './components/order-builder/order-steps'
import { SearchProductComponent } from './components/search-product/search-product.component';
import { OrderDetailCommentsComponent } from './components/order-detail/order-detail-comments/order-detail-comments.component';
import { OrderDetailLogsComponent } from './components/order-detail/order-detail-logs/order-detail-logs.component';

// Pipes
import { 
    NoSpacePipe, 
    ZeroPadPipe, 
    SumGroupProductPipe 
} from './pipes'

// Shared components
import { StepperComponent, Step } from './shared/components/stepper';
import { OrdersService } from './shared/services/orders.service';
import { CreateOrderService } from './shared/services/create-order.service';
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { BreadcrumbsComponent, BreadcrumbsItemComponent } from './shared/components/breadcrumbs'
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { DLSTableComponent } from './shared/components/table/table.component';

// Services
import { WindowRef } from './shared/services/window-ref.service';
import { NguiDatetimePickerModule } from './shared/components/datetimepicker';
import { OrderRequestHelper } from './utils/order-request.helper';
import { OrdersModel } from './shared/schema';

import { 
    Api, 
    ProductLineApi, 
    ShipmentLocationApi,
    OrdersApi,
    LoginApi,
    ProjectProfileApi,
    ContractsApi,
    JobsiteApi,
    ProductsApi,
    OrderDetailApi,
    LegalEntitiesApi,
    ShippingConditionApi
} from './shared/services/api';

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
        SumGroupProductPipe,

        // Regular components
        OrdersTableComponent,
        LoadingTableComponent,
        OrderBuilderComponent,
        LocationStepComponent,
        ProductSelectionStepComponent,
        SpecificationsStepComponent,
        ModeStepComponent,
        ProjectProfileCreatorComponent,
        SearchProductComponent,
        SummaryStepComponent,
        OrderDetailCommentsComponent,
        OrderDetailLogsComponent,

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
        NguiDatetimePickerModule,
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
        OrdersApi,
        OrdersService,
        CreateOrderService,
        LoginApi,
        ProjectProfileApi,
        ContractsApi,
        JobsiteApi,
        OrderRequestHelper,
        OrdersModel,
        Api,
        ProductLineApi,
        ShipmentLocationApi,
        OrdersApi,
        ProductsApi,
        OrderDetailApi,
        ShippingConditionApi,
        LegalEntitiesApi
    ]
};
