/**
 * Author: Daniel Cardenas
 * Responsive table (DLS design)
 * 
 * Usage:
 * <cmx-table [columns]="columns" [rows]="rows"></cmx-table>
 * 
 * 
 * Columns object array
 * ====================================
 * 
 * Properties:
 * name:        Column name (string)
 * width:       Width percentage (number)
 * inner:       Inner HTML for the column, if none provided 'name' will be used (string)
 * sortable:    If column can be sorted (boolean = default true)
 * 
 * Example:
    this.columns = [
        { name: "Name", width: 20 },
        { name: "Discharge Time", width: 10 },
        { name: "Favorite", width: 5, inner: '<i class="fa-star"></i>', sortable: false }
        ...
    ]
 * 
 * 
 * Rows object array
 * ====================================
 * 
 * Properties:
 * inner:   inner HTML to be placed inside the cell (string)
 * click:   callback for the cell when gets clicked (function)
 * class:   css class that are going to be added to the cell (string)
 *          In order to make the classes work you need to add them like this:
 *              /deep/.action-button {
                    color: #51A4F4;
                }
 * 
 * 
 * Example:
    this.rows = [
        [ 
            { inner: "My First Project Profile" }, 
            { inner: "20 min", class: "action-button" },
            ...
        ],
        [ 
            { inner: "My Second Project Profile", click: () => { alert("clicked"); } }, 
            { inner: "20 min", click: this.someFunction },
            ...
        ]
    ]

    someFunction() { console.log("Hello") }
 */

import { Component, OnInit, Input } from '@angular/core';
//import localForage = require("localforage");

@Component({
    selector: 'dls-table',
    templateUrl: './table.html',
    styleUrls: ['./table.scss']
})
export class DLSTableComponent {
    @Input() rows: any[];
    @Input() columns: any[];
    @Input() isLoading: boolean = false;

    //private KEY: string = "CEMEX_ITEMS_QTY";
    //ordersQty;

    constructor() {
        // localForage.getItem('ordersQty').then(ordersQty => {
        //     this.ordersQty = ordersQty;
        // });
    }

    ngOnChanges(changes) {
        // if (this.orders && this.orders.length > 0) {
        //     localForage.setItem(KEY, this.orders.length);
        // }
    }

    tdClicked(fn) {
        if (fn) { fn(); }
    }

    isOdd(n: number): boolean {
        return (n & 1) == 1;
    }
}
