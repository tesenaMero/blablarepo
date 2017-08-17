import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'breadcrumbs-item',
  templateUrl: './breadcrumbs-item.component.html',
  styleUrls: ['./breadcrumbs-item.component.scss']
})

export class BreadcrumbsItemComponent implements OnInit {
  constructor() { }
  @Input() link: string;

  ngOnInit() {

  }

}