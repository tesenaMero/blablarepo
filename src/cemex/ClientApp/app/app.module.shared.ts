import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { OrdersComponent } from './components/orders/orders.component'
import { OrdersTableComponent } from './components/orders-table/orders-table.component'
import { NewOrderComponent } from './components/new-order/new-order.component'
import { CartComponent } from './components/cart/cart.component';
import { NewOrderComponentSt1 } from './components/new-order/neworderst1.component'

export const sharedConfig: NgModule = {
    bootstrap: [ AppComponent ],
    declarations: [
        // Hosts (page route parents)
        AppComponent,
        DashboardComponent,
        OrdersComponent,
        NewOrderComponent,
        CartComponent,
	NewOrderComponentSt1,

        // Regular components
        OrdersTableComponent
    ],
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'app', pathMatch: 'full' },
            { path: 'orders', redirectTo:'app', pathMatch:'full' },
            { path: 'app', component:  DashboardComponent, children: [
                	{ path: '', redirectTo: 'orders', pathMatch:'full' },
		        { path: 'orders', component: OrdersComponent },
		        { path: 'newst1', component: NewOrderComponentSt1 },		    
	        	{ path: 'new', component: NewOrderComponent },
		        { path: 'cart', component: CartComponent },
		]
            },
            { path: '**', redirectTo: 'app' }
        ])
    ]
};
