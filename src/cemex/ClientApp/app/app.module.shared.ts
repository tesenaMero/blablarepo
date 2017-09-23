import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

// Components
import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { DraftsComponent } from './components/drafts/drafts.component';
import { ProjectProfilesComponent } from './components/project-profiles/project-profiles.component';
import { ProjectProfileCreatorComponent } from './components/project-profile-creator/project-profile-creator.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { LoadingTableComponent } from './components/orders-table/loading-table/loading-table.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderBuilderComponent } from './components/order-builder/order-builder.component';
import {
    LocationStepComponent,
    ProductSelectionStepComponent,
    SpecificationsStepComponent,
    ModeStepComponent,
    ReviewStepComponent,
    CheckoutStepComponent,
} from './components/order-builder/order-steps';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { OrderDetailCommentsComponent } from './components/order-detail/order-detail-comments/order-detail-comments.component';
import { OrderDetailLogsComponent } from './components/order-detail/order-detail-logs/order-detail-logs.component';
import { SelectDropdownModule } from './shared/components/selectwithsearch/dropdown.module';
import { CrossProductComponent } from './components/cross-product/crossProduct.component';

// Pipes
import {
    NoSpacePipe,
    ZeroPadPipe,
    SumGroupProductPipe,
    DatePipe
} from './pipes'

// Shared components
import { StepperComponent, Step } from './shared/components/stepper';
import { OrdersService } from './shared/services/orders.service';
import { CreateOrderService } from './shared/services/create-order.service';
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { BreadcrumbsComponent, BreadcrumbsItemComponent } from './shared/components/breadcrumbs'
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { DLSTableComponent } from './shared/components/table/table.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { ModalComponent, ModalService } from './shared/components/modal';

// Services
import { WindowRef } from './shared/services/window-ref.service';
import { NguiDatetimePickerModule } from './shared/components/datetimepicker';
import { OrderRequestHelper } from './utils/order-request.helper';
import { OrdersModel } from './shared/schema';
import { SessionService, AuthGuard } from './shared/services/session.service';
import { DashboardService } from './shared/services/dashboard.service';
import { CustomerService } from './shared/services/customer.service';
import { Broadcaster } from './shared/types/Broadcaster';
import { TranslationService } from './shared/services/translation.service';
import { SearchProductService } from './shared/services/product-search.service';

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
    ShippingConditionApi,
    DraftsService,
    CatalogApi,
    ProductColorApi,
    PlantApi,
    PurchaseOrderApi,
    PaymentTermsApi,
    PingSalesOrderApi,
    SalesDocumentApi,
} from './shared/services/api';

import { EncodeDecodeJsonObjService } from './shared/services/encodeDecodeJsonObj.service';
import { CmxSharedModule } from '@cemex/cmx-shared-v1/dist'
import { CmxCoreCommonModule } from '@cemex-core/angular-services-v2/dist';
import { FlexLayoutModule } from '@angular/flex-layout';

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
        OrderDetailComponent,
        LoginComponent,

        // Pipes
        ZeroPadPipe,
        NoSpacePipe,
        SumGroupProductPipe,
        DatePipe,

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
        ReviewStepComponent,
        CheckoutStepComponent,
        OrderDetailCommentsComponent,
        OrderDetailLogsComponent,
        CrossProductComponent,

        // Shared
        PaginationComponent,
        BreadcrumbsComponent,
        BreadcrumbsItemComponent,
        StepperComponent,
        Step,
        ActionButtonComponent,
        DLSTableComponent,
        NavigationComponent,
        FooterComponent,
        ModalComponent,
    ],
    imports: [
        NguiDatetimePickerModule,
        SelectDropdownModule,
        FlexLayoutModule,
        CmxCoreCommonModule,
        CmxSharedModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'app', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            {
                path: 'app', component: DashboardComponent, canActivate: [AuthGuard], children: [
                    { path: '', redirectTo: 'orders', pathMatch: 'full' },
                    { path: 'orders', component: OrdersComponent },
                    { path: 'new', component: NewOrderComponent },
                    { path: 'cart', component: CartComponent },
                    { path: 'order-detail', component: OrderDetailComponent },
                    { path: 'project-profiles', component: ProjectProfilesComponent },
                    { path: 'drafts', component: DraftsComponent },
                    { path: 'open/:id', component: CrossProductComponent },
                ]
            },
            { path: '**', redirectTo: 'app' }
        ])
    ],
    providers: [
        SessionService,
        AuthGuard,
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
        LegalEntitiesApi,
        DashboardService,
        DraftsService,
        PaymentTermsApi,
        EncodeDecodeJsonObjService,
        CustomerService,
        CatalogApi,
        Broadcaster,
        TranslationService,
        ProductColorApi,
        PlantApi,
        PingSalesOrderApi,
        PurchaseOrderApi,
        SalesDocumentApi,
        SearchProductService,
        ModalService,
    ]
};