import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Input() range: number = 2;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

  pages: Observable<number[]>;

  constructor() { }

  ngOnInit() {
    this.getPages();
    console.log(this.currentPage);
  }

  ngOnChanges() {
    this.getPages();
  }

  getPages() {
    const currentPage = Number(this.currentPage);
    const totalPages = Number(this.totalPages);
    const range = Number(this.range);

    this.pages = Observable.range(-range, range * 2 + 1)
        .map(offset => currentPage + offset)
        .filter(pageNumber => pageNumber > 0 && pageNumber <= totalPages)
        .toArray();
    
  }

  setPage(page: number) {
    this.changePage.emit(page);
  }

}