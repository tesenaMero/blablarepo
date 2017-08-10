import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'orders-table',
  templateUrl: './orders-table.html',
  styleUrls: ['./orders-table.scss', './orders-table.specific.scss']
})
export class OrdersTableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  changePage(page) {
    // TODO
    console.log('handle pagination', page);
  }

}
