import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'step',
    template: `<ng-content></ng-content>`,
    host: {'class': 'carousel-item', '[class.active]': 'active' }
})
export class Step {
    @Input() title?: string;
    @Input() active? = false;

    constructor() { }
}
