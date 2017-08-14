import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'cart-page',
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})

export class CartComponent implements OnInit {
  
  constructor(private location: Location) {}

  ngOnInit() {
    
  }

  back() {
    this.location.back();
  }
}
