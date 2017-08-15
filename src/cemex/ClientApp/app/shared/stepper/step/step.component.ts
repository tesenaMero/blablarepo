import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'stepper',
    template: `<ng-content></ng-content>`
})
export class StepperComponent {

    constructor() { }

    ngOnInit() {
    }

}
